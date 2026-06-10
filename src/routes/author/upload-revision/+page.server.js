import { fail } from '@sveltejs/kit';
import { apiGet } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';

export async function load(event) {
	try {
		const dashboard = await apiGet(
			ENDPOINTS.MANUSCRIPTS.DASHBOARD,
			{},
			event
		);

		return {
			manuscript: dashboard?.data?.manuscript ?? null
		};
	} catch (error) {
		console.error(error);

		return {
			manuscript: null
		};
	}
}

export const actions = {
	default: async ({ request, cookies }) => {
		const token = cookies.get('auth_token');

        console.log('UPLOAD REVISION MASUK');

		if (!token) {
			return fail(401, {
				message: 'Unauthorized'
			});
		}

		const formData = await request.formData();

		const manuscriptId = formData.get('manuscript_id');

		const API_BASE =
			import.meta.env.VITE_API_BASE_URL ||
			'http://localhost:8000/api';

		try {
			const response = await fetch(
				`${API_BASE}/manuscripts/${manuscriptId}/upload-revision`,
				{
					method: 'POST',
					headers: {
						Authorization: `Bearer ${token}`,
						Accept: 'application/json'
					},
					body: formData
				}
			);

			const result = await response.json();

			if (!response.ok) {
				return fail(response.status, {
					message:
						result.message ||
						'Gagal upload revisi',
					errors: result.errors || null
				});
			}

			return {
				success: true,
				data: result.data
			};
		} catch (error) {
			console.error(error);

			return fail(500, {
				message: 'Gagal terhubung ke server'
			});
		}
	}
};