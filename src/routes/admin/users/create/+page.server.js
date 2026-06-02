import { fail, redirect } from '@sveltejs/kit';
import { apiPost } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';

export const actions = {
	create: async ({ request, cookies }) => {
		const formData = await request.formData();

		const name = formData.get('name')?.toString().trim();
		const email = formData.get('email')?.toString().trim();
		const role = formData.get('role')?.toString().trim();
		const password = formData.get('password')?.toString();
		const passwordConfirmation = formData.get('password_confirmation')?.toString();

		if (!name || !email || !role || !password || !passwordConfirmation) {
			return fail(400, {
				error: 'Semua field wajib diisi.',
				values: { name, email, role }
			});
		}

		if (password !== passwordConfirmation) {
			return fail(400, {
				error: 'Konfirmasi password tidak sama.',
				values: { name, email, role }
			});
		}

		try {
			await apiPost(
				ENDPOINTS.USERS.STORE,
				{
					name,
					email,
					role_name: role,
					password,
					password_confirmation: passwordConfirmation
				},
				{ cookies }
			);
		} catch (error) {
			console.error('Failed to create user:', error);

			const validationErrors = error?.data?.errors || error?.data?.data?.errors || null;

			const message =
				error?.data?.message ||
				error?.message ||
				'Gagal menambahkan user. Pastikan email belum digunakan dan data sudah benar.';

			return fail(400, {
				error: validationErrors ? Object.values(validationErrors).flat().join(' ') : message,
				values: { name, email, role }
			});
		}

		throw redirect(303, '/admin/users');
	}
};
