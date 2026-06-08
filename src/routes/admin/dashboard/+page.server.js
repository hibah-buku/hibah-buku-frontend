import { apiGet } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';

export async function load({ cookies }) {
  const token = cookies.get('auth_token');
  
  // cek token ulang
  if (!token) {
    return { stats: null, actions: [] };
  }

  try {
    const response = await apiGet(ENDPOINTS.DASHBOARD.SUMMARY, {}, { cookies });
    const activitiesRes = await apiGet(ENDPOINTS.DASHBOARD.ACTIVITIES, {}, { cookies });

    return {
      stats: response.data,
      links: response.data._links || {},
      activities: activitiesRes.data || []
    };

  } catch (err) {
    console.error('Failed to load dashboard stats:', err);
    return {
      stats: null,
      links: {},
      activities: [],
      error: 'Gagal memuat data dashboard.'
    };
  }
}