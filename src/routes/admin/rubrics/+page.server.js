import { apiGet, apiPost, apiPatch, apiDelete } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';

export const load = async ({ cookies }) => {
	try {
		const res = await apiGet(ENDPOINTS.RUBRICS.INDEX, {}, { cookies });
		return {
			rubrics: res?.data || []
		};
	} catch (error) {
		console.error('[Rubrics] Error loading:', error);
		return {
			rubrics: [],
			error: error?.message || 'Gagal memuat rubrik'
		};
	}
};

export const actions = {
	create: async ({ request, cookies }) => {
		const formData = await request.formData();
		const payload = {
			criteria_name: formData.get('criteria_name'),
			max_score: Number(formData.get('max_score')),
			applicable_book_type: formData.get('applicable_book_type')
		};

		try {
			const res = await apiPost(ENDPOINTS.RUBRICS.INDEX, payload, {}, { cookies });
			if (res?.status === 'success') {
				return { success: true, message: '✓ Sukses: Rubrik berhasil ditambahkan' };
			}
			return { success: false, message: '✗ Gagal: ' + (res?.message || 'Tidak dapat menyimpan data rubrik.') };
		} catch (error) {
			return { success: false, message: '✗ Gagal: ' + (error?.message || 'Tidak dapat menyimpan data rubrik.') };
		}
	},

	update: async ({ request, cookies }) => {
		const formData = await request.formData();
		const id = formData.get('id');
		const payload = {
			criteria_name: formData.get('criteria_name'),
			max_score: Number(formData.get('max_score')),
			applicable_book_type: formData.get('applicable_book_type')
		};

		try {
			// Use PUT via custom fetch since apiPatch uses PATCH but the original code uses PUT
			const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
			const token = cookies.get('auth_token');
			const res = await fetch(`${API_BASE}${ENDPOINTS.RUBRICS.INDEX}/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json',
					...(token ? { Authorization: `Bearer ${token}` } : {})
				},
				body: JSON.stringify(payload)
			});
			const json = await res.json();

			if (json?.status === 'success') {
				return { success: true, message: '✓ Sukses: Rubrik berhasil diperbarui' };
			}
			return { success: false, message: '✗ Gagal: ' + (json?.message || 'Tidak dapat menyimpan data rubrik.') };
		} catch (error) {
			return { success: false, message: '✗ Gagal: ' + (error?.message || 'Tidak dapat menyimpan data rubrik.') };
		}
	},

	delete: async ({ request, cookies }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		try {
			const res = await apiDelete(`${ENDPOINTS.RUBRICS.INDEX}/${id}`, {}, { cookies });
			if (res?.status === 'success') {
				return { success: true, message: '✓ Sukses: Rubrik berhasil dihapus' };
			}
			return { success: false, message: '✗ Gagal: ' + (res?.message || 'Tidak dapat menghapus rubrik.') };
		} catch (error) {
			return { success: false, message: '✗ Gagal: ' + (error?.message || 'Tidak dapat menghapus rubrik.') };
		}
	}
};
