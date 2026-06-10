import { fail } from '@sveltejs/kit';
import { apiGet } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';
 
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
 
export const actions = {
	upload: async ({ request, cookies }) => {
		const formData = await request.formData();
		const file = formData.get('contract_file');
 
		if (!file || file.size === 0) {
			return fail(400, {
				success: false,
				message: 'File harus dipilih'
			});
		}
 
		const isPdf =
			file.type === 'application/pdf' ||
			file.name.toLowerCase().endsWith('.pdf');
 
		if (!isPdf) {
			return fail(400, {
				success: false,
				message: 'File harus berformat PDF'
			});
		}
 
		const maxSize = 5 * 1024 * 1024;
		if (file.size > maxSize) {
			return fail(400, {
				success: false,
				message: 'Ukuran file maksimal 5 MB'
			});
		}
 
		try {
			const token = cookies.get('auth_token');
 
			const response = await fetch(`${API_BASE}${ENDPOINTS.CONTRACTS.STORE}`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: formData
			});
 
			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				return fail(response.status, {
					success: false,
					message: errorData.message || 'Upload gagal, coba lagi.'
				});
			}
 
			return {
				success: true,
				message: 'Kontrak berhasil diunggah dan sedang menunggu validasi admin.'
			};
		} catch (error) {
			console.error('Failed to upload contract:', error);
			return fail(500, {
				success: false,
				message: 'Terjadi kesalahan server, coba lagi.'
			});
		}
	}
};
 
export async function load({ cookies }) {
	try {
		const response = await apiGet(ENDPOINTS.CONTRACTS.MY_CONTRACT, {}, { cookies });
		console.log(response);
 
		return {
			contract: response.data ?? null
		};
	} catch (error) {
		console.error('Failed to load contract:', error);
		return {
			contract: null
		};
	}
}
