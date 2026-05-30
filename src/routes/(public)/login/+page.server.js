import { fail, isRedirect, redirect } from '@sveltejs/kit';
import { apiPost } from '$lib/api/client.js';
import { apiGet	 } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		if (!email || !password) {
			return fail(400, { message: 'Email dan password wajib diisi.' });
		}

		let token;
		let errorMsg;
		try {
			const response = await apiPost(ENDPOINTS.AUTH.LOGIN, { email, password });

			console.log('Response Login Laravel:', response);
			token = response.data.token;

			if (!token) {
				throw new Error('Token tidak diterima dari server.');
			}

			cookies.set('auth_token', token, {
				path: '/',
				httpOnly: true,
				sameSite: 'lax',
				secure: false, // Set true jika sudah pakai HTTPS
				maxAge: 60 * 60 * 24 * 30
			});

			// Mendeteksi peran pengguna secara dinamis dari profil mereka
			try {
				const profileResponse = await apiGet(ENDPOINTS.AUTH.ME, {}, { cookies });
				const user = profileResponse.data;

				if (user?.role === 'penulis') {
					throw redirect(303, '/author/dashboard');
				} else if (user?.role === 'admin') {
					throw redirect(303, '/admin/dashboard');
				}
			} catch (profileErr) {
				if (isRedirect(profileErr)) {
					throw profileErr;
				}
				console.error('[Login Action] Gagal mendeteksi role pengguna:', profileErr);
			}

			// Fallback jika pendeteksian role gagal
			throw redirect(303, '/admin/dashboard');
		} catch (err) {
			if (isRedirect(err)) {
				throw err;
			}

			console.error('Login Error:', err);
			errorMsg = 'Terjadi kesalahan server.';

			if (err.status === 401 || err.data?.status === 'error') {
				errorMsg = 'Email atau password salah.';
			} else if (err.message && !err.message.includes('Redirect')) {
				errorMsg = err.message;
			}

			// Error lainnya
			return fail(err.status || 500, {
				message: errorMsg
			});
		}
	}
};
