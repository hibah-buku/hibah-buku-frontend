import { redirect } from '@sveltejs/kit';
import { apiGet } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';
import { extractNotificationLogs, filterNotificationsForUser } from '$lib/api/notifications.js';

export const load = async ({ cookies }) => {
  const token = cookies.get('auth_token');

  if (!token) {
    throw redirect(303, '/login');
  }

  try {
    const profileResponse = await apiGet(ENDPOINTS.AUTH.ME, {}, { cookies });
    const user = profileResponse?.data || null;

    if (!user || String(user.role || '').toLowerCase() !== 'admin') {
      throw redirect(303, '/login');
    }

    const notificationResponse = await apiGet(ENDPOINTS.NOTIFICATIONS.LOGS, {}, { cookies }).catch(() => null);
    const notificationLogs = filterNotificationsForUser(extractNotificationLogs(notificationResponse), user.email);

    return {
      isAuthenticated: true,
      user,
      notificationLogs
    };
  } catch (error) {
    if (error?.status === 303) {
      throw error;
    }

    console.error('[Admin Layout Loader] Gagal mengambil data notifikasi:', error);

    return {
      isAuthenticated: true,
      user: null,
      notificationLogs: []
    };
  }
};