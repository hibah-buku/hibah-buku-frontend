import { apiGet } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';

// --- Helper Functions ---
function extractPayload(response) {
  if (response && typeof response === 'object' && 'data' in response) return response.data;
  return response ?? {};
}

function extractList(response, listKey = 'items') {
  const payload = extractPayload(response);
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.[listKey])) return payload[listKey];
  if (Array.isArray(payload?.data?.[listKey])) return payload.data[listKey];
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
}

function normalizeManuscript(item) {
  if (!item) return null;
  const author = item.author ?? {};
  const authorName = typeof author === 'string'
    ? author
    : author?.name ?? author?.full_name ?? item.author_name ?? null;

  return {
    ...item,
    author_name: authorName ?? '-',
    author: typeof author === 'string' ? author : author?.name ?? author,
    author_email: typeof author === 'object' ? author?.email ?? null : null
  };
}

export async function load({ cookies }) {
  const token = cookies.get('auth_token');
  if (!token) return { authRequired: true, manuscripts: [] };

  try {
    const manuscriptsResponse = await apiGet(ENDPOINTS.PUBLISHER.MANUSCRIPTS, {}, { cookies });
    const allManuscripts = extractList(manuscriptsResponse, 'items').map((item) => normalizeManuscript(item?.manuscript ?? item));
    

    return { manuscripts: allManuscripts };
  } catch {
    return { manuscripts: [], error: 'Gagal memuat daftar naskah.' };
  }
}