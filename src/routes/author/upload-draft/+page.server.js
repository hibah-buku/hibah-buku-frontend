import { fail, redirect } from '@sveltejs/kit';
import { apiGet } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';

export const load = async (event) => {
	const token = event.cookies.get('auth_token');
	if (!token) {
		throw redirect(303, '/login');
	}

	try {
		const response = await apiGet(ENDPOINTS.MANUSCRIPTS.DASHBOARD, {}, event);
		console.log('[DEBUG UPLOAD DRAFT LOADER] Respon API Laravel:', JSON.stringify(response, null, 2));
		return {
			willingness: response.data?.willingness ?? null
		};
	} catch (err) {
		console.error('[Upload Draft Loader] Gagal memuat willingness:', err);
		return {
			willingness: null
		};
	}
};

export const actions = {
	default: async ({ request, cookies }) => {
		const token = cookies.get('auth_token');
		if (!token) {
			throw redirect(303, '/login');
		}

		const formData = await request.formData();

		// Mengarahkan ke base URL API Laravel
		const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

		try {
			const response = await fetch(`${API_BASE}/manuscripts/upload-draft`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Accept': 'application/json'
				},
				body: formData
			});

			const resData = await response.json();

			if (!response.ok) {
				return fail(response.status, {
					message: resData.message || 'Gagal mengunggah naskah draft.',
					errors: resData.errors || null
				});
			}

			return {
				success: true,
				manuscript: resData.data
			};
		} catch (err) {
			console.error('[Upload Draft Action] Gagal:', err);
			return fail(500, { message: 'Gagal terhubung ke server Laravel backend.' });
		}
	}
};
