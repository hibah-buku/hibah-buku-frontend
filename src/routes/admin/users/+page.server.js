import { apiGet } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';

export async function load({ cookies, url }) {
	const token = cookies.get('auth_token');

	const search = url.searchParams.get('search') || '';
	const role = url.searchParams.get('role') || '';
	const page = url.searchParams.get('page') || '1';

	if (!token) {
		return { users: [], meta: null, filters: { search, role, page } };
	}

	try {
		const response = await apiGet(
			ENDPOINTS.USERS.INDEX,
			{ search, role, page },
			{ cookies }
		);

		const payload = response.data ?? {};

		return {
			users: payload.items ?? [],
			meta: payload.meta ?? {},
			filters: { search, role, page },
			error: null
		};
	} catch (error) {
		console.error('Failed to load users:', error);
		return {
			users: [],
			meta: null,
			filters: { search, role, page },
			error: 'Gagal memuat data user.'
		};
	}
}
