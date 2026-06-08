import { apiGet, apiPost } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';

export const load = async ({ cookies }) => {
	try {
		const [revRes, tasksRes] = await Promise.all([
			apiGet(ENDPOINTS.REVIEWERS.INDEX, {}, { cookies }),
			apiGet(ENDPOINTS.DASHBOARD.TASKS, {}, { cookies })
		]);

		return {
			reviewers: revRes?.data || [],
			unassigned: tasksRes?.data?.unassigned || []
		};
	} catch (error) {
		console.error('[Plotting] Error loading data:', error);
		return {
			reviewers: [],
			unassigned: [],
			error: error?.message || 'Gagal memuat data'
		};
	}
};

export const actions = {
	assign: async ({ request, cookies }) => {
		const formData = await request.formData();

		const payload = {
			manuscript_id: Number(formData.get('manuscript_id')),
			book_title: formData.get('book_title'),
			author_id: Number(formData.get('author_id')),
			author_email: formData.get('author_email'),
			manuscript_file_url: formData.get('manuscript_file_url'),
			reviewer_id: Number(formData.get('reviewer_id')),
			reviewer_name: formData.get('reviewer_name'),
			reviewer_email: formData.get('reviewer_email'),
			deadline_review: formData.get('deadline_review')
		};

		try {
			const res = await apiPost(ENDPOINTS.ASSIGNMENTS.STORE, payload, {}, { cookies });

			if (res?.status === 'success') {
				// Send notification
				try {
					await apiPost(
						ENDPOINTS.ASSIGNMENTS.NOTIFY(res.data.id),
						{ to_email: payload.reviewer_email },
						{},
						{ cookies }
					);
				} catch {
					// Notification failure is non-critical
				}

				return { success: true, message: `Naskah "${payload.book_title}" berhasil di-plot ke ${payload.reviewer_name}` };
			}

			return { success: false, message: res?.message || 'Gagal plot naskah' };
		} catch (error) {
			return { success: false, message: error?.message || 'Terjadi kesalahan saat assign reviewer' };
		}
	}
};
