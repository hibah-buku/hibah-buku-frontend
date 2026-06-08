import { fail, redirect } from '@sveltejs/kit';
import { apiGet, apiDelete } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';

export async function load({ cookies, url }) {
	const token = cookies.get('auth_token');

	const search = url.searchParams.get('search') || '';
	const role = url.searchParams.get('role') || '';
	const page = url.searchParams.get('page') || '1';
	const includeDeleted = url.searchParams.get('include_deleted') === '1' ? '1' : '';

	if (!token) {
		return {
			users: [],
			meta: null,
			filters: { search, role, page, includeDeleted },
			error: null
		};
	}

	try {
		const response = await apiGet(
			ENDPOINTS.USERS.INDEX,
			{
				search,
				role,
				page,
				include_deleted: includeDeleted
			},
			{ cookies }
		);

		const payload = response.data ?? {};

		return {
			users: payload.items ?? [],
			meta: payload.meta ?? {},
			filters: { search, role, page, includeDeleted },
			error: null
		};
	} catch (error) {
		console.error('Failed to load users:', error);

		return {
			users: [],
			meta: null,
			filters: { search, role, page, includeDeleted },
			error: 'Gagal memuat data user.'
		};
	}
}

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const id = formData.get('id')?.toString();

		if (!id) {
			return fail(400, {
				error: 'ID user tidak ditemukan.'
			});
		}

		try {
			await apiDelete(ENDPOINTS.USERS.DESTROY(id),{}, { cookies });
		} catch (error) {
			console.error('Failed to deactivate user:', error);

			return fail(400, {
				error: error?.data?.message || error?.message || 'Gagal menonaktifkan user.'
			});
		}

		// Setelah delete, langsung tampilkan user inactive juga
		throw redirect(303, '/admin/users?include_deleted=1');
	}
};