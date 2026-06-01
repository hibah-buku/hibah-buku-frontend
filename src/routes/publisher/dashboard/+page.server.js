import { apiGet } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';

// --- Helper Functions ---
function extractPayload(response) {
  if (response && typeof response === 'object' && 'data' in response) {
    return response.data;
  }
  return response ?? {};
}

function normalizeCount(value, fallback = 0) {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
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

function normalizeStatusKey(value) {
  return String(value ?? '').trim().toLowerCase().replace(/\s+/g, '_');
}
// ------------------------

export async function load({ cookies }) {
  const token = cookies.get('auth_token');

  if (!token) {
    return { authRequired: true, error: 'Silakan login terlebih dahulu.' };
  }

  try {
    const dashboardResponse = await apiGet(ENDPOINTS.PUBLISHER.DASHBOARD, {}, { cookies });
    const dashboardPayload = extractPayload(dashboardResponse);

    const manuscriptsResponse = await apiGet(ENDPOINTS.PUBLISHER.MANUSCRIPTS, {}, { cookies });
    const allManuscripts = extractList(manuscriptsResponse, 'items')
      .map((item) => normalizeManuscript(item?.manuscript ?? item))
      .filter(Boolean);

    const prePrintManuscripts = allManuscripts
      .filter((item) => ['preprint', 'pra_cetak', 'pre_print', 'pre-cetak'].includes(normalizeStatusKey(item?.status)))
      .slice(0, 5);

    return {
      summary: {
        pre_print: normalizeCount(dashboardPayload?.pending_checks ?? dashboardPayload?.pre_print ?? 0),
        revised: normalizeCount(dashboardPayload?.revision_requests ?? dashboardPayload?.revised ?? 0),
        approved: normalizeCount(dashboardPayload?.approved_manuscripts ?? dashboardPayload?.approved ?? 0)
      },
      quickManuscripts: prePrintManuscripts,
      authRequired: false
    };
  } catch (error) {
    console.error('Failed to load dashboard:', error);
    return {
      summary: { pre_print: 0, revised: 0, approved: 0 },
      quickManuscripts: [],
      error: 'Gagal memuat dashboard.'
    };
  }
}
