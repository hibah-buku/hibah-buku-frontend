import { redirect } from '@sveltejs/kit';
import { apiGet } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';

export async function load({ cookies }) {
    const token = cookies.get('auth_token');

    if (!token) {
        throw redirect(303, '/login');
    }

    try {
        const response = await apiGet(ENDPOINTS.AUTH.ME, {}, { cookies });
        const user = response?.data || null;

        if (!user || String(user?.role).toLowerCase() !== 'reviewer') {
            throw redirect(303, '/');
        }

        // Fetch assignments for this reviewer
        let assignments = [];
        if (user.reviewer_id) {
            try {
                const assignRes = await apiGet(
                    ENDPOINTS.REVIEWERS.ASSIGNMENTS(encodeURIComponent(String(user.reviewer_id))),
                    {},
                    { cookies }
                );
                if (assignRes?.status === 'success') {
                    assignments = assignRes.data || [];
                }
            } catch (e) {
                console.error('[Reviewer] Error loading assignments:', e);
            }
        }

        return {
            user,
            assignments
        };
    } catch (err) {
        if (err?.status === 303) throw err;
        throw redirect(303, '/login');
    }
}
