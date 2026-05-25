import { apiGet } from '$lib/api/client.js';
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
