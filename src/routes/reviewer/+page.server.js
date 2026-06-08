import { redirect } from '@sveltejs/kit';
import { apiGet } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';

export async function load({ cookies }) {
    try {
        const response = await apiGet(ENDPOINTS.AUTH.ME, {}, { cookies });
        const user = response.data;
        
        if (String(user?.role).toLowerCase() !== 'reviewer') {
            throw redirect(303, '/');
        }

        return {
            user: user
        };
    } catch (err) {
        throw redirect(303, '/login');
    }
}
