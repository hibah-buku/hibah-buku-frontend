import { apiGet } from '$lib/api/client.js';
import { apiPatch } from '$lib/api/client.js';
import { fail } from '@sveltejs/kit';
import { ENDPOINTS } from '$lib/api/endpoint.js';

export async function load({ cookies, url }) {
	const token = cookies.get('auth_token');

	const search = url.searchParams.get('search') || '';
	const status = url.searchParams.get('status') || '';
	const page = url.searchParams.get('page') || '1';

	if (!token) {
		return { forms: [], meta: null, filters: { search, status, page } };
	}

	try {
		const response = await apiGet(
			ENDPOINTS.WILLINGNESS.INDEX,
			{ search, status, page },
			{ cookies }
		);

		const payload = response.data ?? {};
        console.log(payload)

		return {
			forms: payload.items ?? [],
			meta: payload.meta ?? {},
			filters: { search, status, page },
			error: null
		};
	} catch (error) {
		console.error('Failed to load willingness forms:', error);
		return {
			forms: [],
			meta: null,
			filters: { search, status, page },
			error: 'Gagal memuat data formulir.'
		};
	}
}

export const actions = {
	approve: async ({ request, cookies }) => {
		const data = await request.formData();
		const id = data.get('id');

		try {
			const result = await apiPatch(
				ENDPOINTS.WILLINGNESS.APPROVE(id),
				{},
				{},
				{ cookies }
			);

			return {
				success: true,
				message: result.message
			};

		} catch (error) {
			return fail(error.status || 500, {
				message: error?.data?.message || 'Gagal menyetujui formulir'
			});
		}
	},

	reject: async ({ request, cookies }) => {
		const data = await request.formData();
		const id = data.get('id');
		
		const rejection_reason =
			data.get('rejection_reason');

		try {
			const result = await apiPatch(
				ENDPOINTS.WILLINGNESS.REJECT(id),
				{
					rejection_reason
				},
				{},
				{ cookies }
			);

			return {
				success: true,
				message: result.message
			};
			
		} catch (error) {
			return fail(error.status || 500, {
				message: error?.data?.message || 'Gagal menolak formulir'
			});
		}
	}
};