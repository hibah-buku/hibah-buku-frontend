import { redirect } from '@sveltejs/kit';
import { apiGet } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';
import { extractNotificationLogs, filterNotificationsForUser } from '$lib/api/notifications.js';

export async function load({ cookies }) {
  const token = cookies.get('auth_token');

  if (!token) {
    throw redirect(307, '/login');
  }

  try {
    const profileResponse = await apiGet(ENDPOINTS.AUTH.ME, {}, { cookies }).catch(() => null);
    const user = profileResponse?.data || null;

    const notificationResponse = await apiGet(ENDPOINTS.NOTIFICATIONS.LOGS, {}, { cookies }).catch(() => null);
    const finalLogs = filterNotificationsForUser(extractNotificationLogs(notificationResponse), user?.email);

    return {
      user,
      notificationLogs: finalLogs
    };
  } catch (error) {
    console.error('Failed to load global publisher layout data:', error);
    return {
      notificationLogs: []
    };
  }
}