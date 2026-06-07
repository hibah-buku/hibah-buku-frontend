import { redirect } from '@sveltejs/kit';
import { apiGet } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';

export async function load({ cookies }) {
  const token = cookies.get('auth_token');

  if (!token) {
    throw redirect(307, '/login');
  }

  try {
    // Mengambil data log notifikasi dari Backend secara global di sisi server
    const notificationResponse = await apiGet(ENDPOINTS.NOTIFICATIONS.LOGS, {}, { cookies }).catch(() => null);
    
    let finalLogs = [];
    if (notificationResponse && notificationResponse.data) {
      finalLogs = Array.isArray(notificationResponse.data.data) 
        ? notificationResponse.data.data 
        : (Array.isArray(notificationResponse.data) ? notificationResponse.data : []);
    }

    // Meneruskan data ke seluruh komponen & halaman anak di bawah folder /publisher
    return {
      notificationLogs: finalLogs
    };
  } catch (error) {
    console.error('Failed to load global publisher layout data:', error);
    return {
      notificationLogs: []
    };
  }
}