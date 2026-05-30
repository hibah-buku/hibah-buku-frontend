import { redirect } from '@sveltejs/kit';
import { apiGet } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';

export const load = async (event) => {
	const token = event.cookies.get('auth_token');

	if (!token) {
		throw redirect(303, '/login');
	}

	try {
		const response = await apiGet(ENDPOINTS.AUTH.ME, {}, event);
		const user = response.data;

		// Role guard: pastikan pengguna memiliki peran penulis
		if (user.role !== 'penulis') {
			if (user.role === 'admin') {
				throw redirect(303, '/admin/dashboard');
			}
			throw redirect(303, '/login');
		}

		return {
			isAuthenticated: true,
			user
		};
	} catch (err) {
		if (err.status === 303) throw err;

		console.error('[Author Layout Loader] Gagal mengambil profil user:', err);

		// Jika terjadi error autentikasi (token tidak valid/kedaluwarsa), redirect ke login
		if (err.status === 401) {
			event.cookies.delete('auth_token', { path: '/' });
			throw redirect(303, '/login');
		}

		// Fallback jika API backend offline sementara tetapi token masih ada di cookies
		return {
			isAuthenticated: true,
			user: { name: 'Penulis Hibah', role: 'penulis', email: 'penulis@example.com' }
		};
	}
};
