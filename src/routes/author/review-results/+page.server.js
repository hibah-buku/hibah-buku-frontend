import { apiGet } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';

export async function load(event) {
	const token = event.cookies.get('auth_token');
	if (!token) {
		return { reviews: [], manuscriptStatus: '-', error: null };
	}

	try {
		const [reviewsRes, dashboardRes] = await Promise.all([
			apiGet(ENDPOINTS.MANUSCRIPTS.REVIEW_RESULTS, {}, event),
			apiGet(ENDPOINTS.MANUSCRIPTS.DASHBOARD, {}, event).catch(() => null)
		]);

		const reviews = reviewsRes?.data ?? [];
		const manuscriptStatus = dashboardRes?.data?.manuscript?.current_status?.label ?? '-';

		return {
			reviews,
			manuscriptStatus,
			error: null
		};
	} catch (err) {
		console.error('[Author Review Results Load] Error:', err);
		return {
			reviews: [],
			manuscriptStatus: '-',
			error: 'Gagal mengambil data hasil review.'
		};
	}
}