import { redirect } from '@sveltejs/kit';
import { apiGet } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';

export const load = async ({ cookies }) => {
  const token = cookies.get('auth_token');

  if (!token) {
    throw redirect(303, '/login');
  }

  try {
    const response = await apiGet(ENDPOINTS.AUTH.ME, {}, { cookies });
    const user = response?.data || null;
    const role = String(user?.role || '').toLowerCase();

    if (role === 'admin') {
      throw redirect(303, '/admin/dashboard');
    } else if (role === 'reviewer') {
      throw redirect(303, '/reviewer');
    } else if (role === 'author' || role === 'penulis') {
      throw redirect(303, '/author');
    } else if (role === 'publisher' || role === 'penerbit') {
      throw redirect(303, '/publisher');
    }
  } catch (error) {
    if (error?.status === 303) {
      throw error;
    }
  }

  throw redirect(303, '/login');
};
