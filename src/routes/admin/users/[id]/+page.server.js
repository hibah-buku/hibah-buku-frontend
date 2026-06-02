import { apiGet } from '$lib/api/client.js';
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
		console.error('Failed to load user detail:', error);

		return {
			user: null,
			error: 'Gagal memuat detail user.'
		};
	}
}
