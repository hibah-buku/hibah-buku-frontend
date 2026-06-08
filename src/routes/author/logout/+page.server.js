import { redirect } from '@sveltejs/kit';

/** @satisfies {import('./$types').Actions} */
export const actions = {
	logout: async ({ cookies }) => {
		cookies.delete('auth_token', {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false
		});

		throw redirect(303, '/login');
	}
};
