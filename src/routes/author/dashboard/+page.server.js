import { apiGet } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';

/** @type {import('./$types').PageServerLoad} */
export async function load(event) {
	const token = event.cookies.get('auth_token');
	if (!token) {
		return { dashboardData: null };
	}

	try {
		const response = await apiGet(ENDPOINTS.MANUSCRIPTS.DASHBOARD, {}, event);
		return {
			dashboardData: response.data ?? null,
			error: null
		};
	} catch (err) {
		console.error('[Author Dashboard Loader] Gagal memuat data:', err);
		return {
			dashboardData: null,
			error: 'Gagal mengambil data dari server backend Laravel.'
		};
	}
}
