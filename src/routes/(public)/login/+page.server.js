import { fail, redirect } from '@sveltejs/kit';
import { apiPost } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		try {
			const response = await apiPost(ENDPOINTS.AUTH.LOGIN, { email, password });

			console.log('Response Login Laravel:', response);
			const token = response.data.token;

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

			// Redirect ke Dashboard Admin setelah login sukses
			throw redirect(303, '/admin/dashboard');
		} catch (err) {

            if (err?.status === 303) {
                throw err;
            }

			console.error('Login Error:', err);
			let errorMsg = 'Terjadi kesalahan server.';

			if (err.status === 401 || err.data?.status === 'error') {
				errorMsg = 'Email atau password salah.';
			} else if (err.message) {
				errorMsg = err.message;
			}

			// Error lainnya
            return fail(err.status || 500, {
                    message: errorMsg
                });
		}
	}
};
