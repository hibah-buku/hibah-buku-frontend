import { apiGet } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';
import { fail } from '@sveltejs/kit'; // Tambahkan import fail dari SvelteKit

export async function load({ cookies, url }) {
    const token = cookies.get('auth_token');

    // Ambil parameter filter dari URL
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || ''; // Misal: contract_uploaded, contract_validated
    const page = url.searchParams.get('page') || '1';

    if (!token) {
        return { 
            contracts: [], 
            meta: null, 
            filters: { search, status, page } 
        };
    }

    try {
        const response = await apiGet(
            ENDPOINTS.CONTRACTS.INDEX, // Pastikan endpoint ini ada di config Anda
            { search, status, page },
            { cookies }
        );

        const payload = response.data ?? {};

        return {
            contracts: payload.items ?? [], // Array data kontrak
            meta: payload.meta ?? {},       // Metadata pagination
            filters: { search, status, page },
            error: null
        };
    } catch (error) {
        console.error('Failed to load contracts:', error);
        return {
            contracts: [],
            meta: null,
            filters: { search, status, page },
            error: 'Gagal memuat data kontrak.'
        };
    }
}

// --- TAMBAHAN ACTIONS UNTUK APPROVE DAN REJECT ---
export const actions = {
    approve: async ({ request, cookies }) => {
        const formData = await request.formData();
        const id = formData.get('id');
        const token = cookies.get('auth_token'); 

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/contracts/${id}/validate`, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return fail(response.status, { 
                    message: errorData.message || 'Gagal memvalidasi kontrak di server.' 
                });
            }

            return { success: true };
        } catch (err) {
            console.error(err);
            return fail(500, { message: 'Terjadi kesalahan koneksi ke server backend.' });
        }
    },

    reject: async ({ request, cookies }) => {
        const formData = await request.formData();
        const id = formData.get('id');
        const token = cookies.get('auth_token'); 

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/contracts/${id}/reject`, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return fail(response.status, { 
                    message: errorData.message || 'Gagal menolak kontrak di server.' 
                });
            }

            return { success: true };
        } catch (err) {
            console.error(err);
            return fail(500, { message: 'Terjadi kesalahan koneksi ke server backend.' });
        }
    }
};