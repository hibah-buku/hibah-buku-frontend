import { fail, redirect } from '@sveltejs/kit';
import { apiGet, apiPatch } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';

export async function load({ cookies, params }) {
	const token = cookies.get('auth_token');
	const id = params.id;

	if (!token) {
		return {
			user: null,
			error: 'Token tidak ditemukan. Silakan login kembali.'
		};
	}

	try {
		const response = await apiGet(ENDPOINTS.USERS.SHOW(id), {}, { cookies });

		const payload = response.data ?? {};

		return {
			user: payload.data ?? payload.user ?? payload,
			error: null
		};
	} catch (error) {
		console.error('Failed to load user for edit:', error);

		return {
			user: null,
			error: 'Gagal memuat data user.'
		};
	}
}

export const actions = {
	update: async ({ request, cookies, params }) => {
		const id = params.id;
		const formData = await request.formData();

		const name = formData.get('name')?.toString().trim();
		const email = formData.get('email')?.toString().trim();

		if (!name || !email) {
			return fail(400, {
				error: 'Nama dan email wajib diisi.',
				values: { name, email }
			});
		}

		try {
			await apiPatch(ENDPOINTS.USERS.UPDATE(id), { name, email },{}, { cookies });
		} catch (error) {
			console.error('Failed to update user:', error);

			return fail(400, {
				error: 'Gagal mengupdate data user.',
				values: { name, email }
			});
		}

		throw redirect(303, `/admin/users/${id}`);
	}
};
