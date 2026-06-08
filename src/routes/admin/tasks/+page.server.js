import { apiGet } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';

export const load = async ({ cookies }) => {
	try {
		const res = await apiGet(ENDPOINTS.DASHBOARD.TASKS, {}, { cookies });

		if (res?.status === 'success') {
			return {
				unassigned: res.data?.unassigned || [],
				assigned: res.data?.assigned || [],
				completed: res.data?.completed || []
			};
		}

		return {
			unassigned: [],
			assigned: [],
			completed: [],
			error: res?.message || 'Gagal memuat tugas'
		};
	} catch (error) {
		console.error('[Tasks] Error loading data:', error);
		return {
			unassigned: [],
			assigned: [],
			completed: [],
			error: error?.message || 'Terjadi kesalahan'
		};
	}
};
