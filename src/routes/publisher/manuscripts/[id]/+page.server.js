import { fail } from '@sveltejs/kit';
import { apiGet, apiPost } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';

// --- Helper Functions ---
function extractPayload(response) {
  if (response && typeof response === 'object' && 'data' in response) return response.data;
  return response ?? {};
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
// ------------------------

export async function load({ cookies, params }) {
  const manuscriptId = params.id;

  try {
    const detailResponse = await apiGet(ENDPOINTS.PUBLISHER.MANUSCRIPT_DETAIL(manuscriptId), {}, { cookies });
    const selectedManuscript = normalizeManuscript(extractPayload(detailResponse)?.manuscript ?? extractPayload(detailResponse));
    return { selectedManuscript };
  } catch {
    return { selectedManuscript: null, error: 'Gagal memuat detail naskah.' };
  }
}

export const actions = {
  default: async ({ request, cookies, params }) => {
    const data = await request.formData();
    const manuscriptId = params.id;
    const decision = data.get('decision')?.toString().trim();

    if (!decision) return fail(400, { message: 'Keputusan harus diisi (Approved / Revised).' });

    const payload = {
      decision,
      revision_notes: data.get('revision_notes')?.toString().trim() ?? '',
      cover_design_ok: data.get('cover_design_ok') === 'on' || data.get('cover_design_ok') === 'true',
      page_count_ok: data.get('page_count_ok') === 'on' || data.get('page_count_ok') === 'true',
      admin_docs_ok: data.get('admin_docs_ok') === 'on' || data.get('admin_docs_ok') === 'true',
      check_notes: data.get('check_notes')?.toString().trim() ?? ''
    };

    try {
      const token = cookies.get('auth_token');
      
      await apiPost(ENDPOINTS.PUBLISHER.DECISION(manuscriptId), payload, { 
        cookies,
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      return { success: true, message: `Keputusan berhasil disimpan dan notifikasi telah dikirim.` };
    } catch (error) {
      console.log("ERROR DARI BACKEND:", error.response?.data || error.message || error);
      return fail(500, { message: 'Gagal mengirim keputusan ke server.' });
    }
  }
};