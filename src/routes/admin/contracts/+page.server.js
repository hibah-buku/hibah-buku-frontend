import { apiGet, apiPatch } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';
import { fail } from '@sveltejs/kit'; 

export async function load({ cookies, url }) {
    const token = cookies.get('auth_token');

    // parameter filter dari URL
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || ''; 
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
            ENDPOINTS.CONTRACTS.INDEX, 
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

        try {
            await apiPatch(ENDPOINTS.CONTRACTS.VALIDATE(id), {}, {}, { cookies });
            return { success: true };
        } catch (err) {
            console.error(err);

            if (err?.status) {
                return fail(err.status, {
                    message: err.data?.message || 'Gagal memvalidasi kontrak di server.'
                });
            }

            return fail(500, { message: 'Terjadi kesalahan koneksi ke server backend.' });
        }
    },

    reject: async ({ request, cookies }) => {
        const formData = await request.formData();
        const id = formData.get('id');
        const rejection_reason = formData.get('rejection_reason')

        try {
            await apiPatch(ENDPOINTS.CONTRACTS.REJECT(id), {rejection_reason}, {}, { cookies });
            return { success: true };
        } catch (err) {
            console.error(err);

            if (err?.status) {
                return fail(err.status, {
                    message: err.data?.message || 'Gagal menolak kontrak di server.'
                });
            }

            return fail(500, { message: 'Terjadi kesalahan koneksi ke server backend.' });
        }
    }
};