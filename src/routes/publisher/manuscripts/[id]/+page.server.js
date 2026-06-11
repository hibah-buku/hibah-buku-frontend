import { fail } from '@sveltejs/kit';
import { apiGet, apiPost } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

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
  submitDecision: async ({ request, cookies, params }) => {
    const data = await request.formData();
    const manuscriptId = params.id;
    const decision = data.get('decision')?.toString().trim().toLowerCase();

    if (!decision) return fail(400, { message: 'Keputusan harus diisi (approved / revised).' });

    const coverDesignOk = data.get('cover_design_ok') === 'true' || data.get('cover_design_ok') === 'on';
    const pageCountOk = data.get('page_count_ok') === 'true' || data.get('page_count_ok') === 'on';
    const adminDocsOk = data.get('admin_docs_ok') === 'true' || data.get('admin_docs_ok') === 'on';
    
    const revisionNotes = data.get('revision_notes')?.toString().trim() ?? '';
    const checkNotes = data.get('check_notes')?.toString().trim() ?? '';

    if (decision === 'approved' && !(coverDesignOk && pageCountOk && adminDocsOk)) {
      return fail(422, {
        message: 'Keputusan approved hanya dapat dikirim bila semua checklist terpenuhi.',
        errors: {
          cover_design_ok: ['Checklist cover design, page count, dan admin docs harus semua benar untuk keputusan approved.']
        }
      });
    }

    if (decision === 'revised' && !revisionNotes) {
      return fail(422, {
        message: 'Catatan revisi wajib diisi saat keputusan revised.',
        errors: {
          revision_notes: ['Catatan revisi wajib diisi agar keputusan dapat dikirim.']
        }
      });
    }

    const payload = {
      decision,
      revision_notes: revisionNotes,
      cover_design_ok: coverDesignOk,
      page_count_ok: pageCountOk,
      admin_docs_ok: adminDocsOk,
      check_notes: checkNotes
    };

    try {
      const token = cookies.get('auth_token');

      await apiPost(ENDPOINTS.PUBLISHER.DECISION(manuscriptId), payload, {
        cookies,
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      return { success: true, message: 'Keputusan berhasil disimpan dan notifikasi telah dikirim.' };
    } catch (error) {
      console.error('ERROR DARI BACKEND:', error.response?.data || error.message || error);
      return fail(error.status || 500, {
        message: error.data?.message || 'Gagal mengirim keputusan ke server.'
      });
    }
  },

  // ✨ FIX: Download naskah lewat server agar token bisa dikirim
  downloadManuscript: async ({ cookies, params }) => {
    const token = cookies.get('auth_token');
    if (!token) return fail(401, { message: 'Sesi habis, silakan login ulang.' });

    try {
      const response = await fetch(`${API_BASE}/manuscripts/${params.id}/download`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) return fail(response.status, { message: 'Gagal mengunduh file naskah.' });

      const arrayBuffer = await response.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString('base64');
      const contentType = response.headers.get('Content-Type') || 'application/octet-stream';
      const disposition = response.headers.get('Content-Disposition') || '';
      const filenameMatch = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      const filename = filenameMatch ? filenameMatch[1].replace(/['"]/g, '') : 'naskah.pdf';

      return { downloadData: { base64, contentType, filename } };
    } catch {
      return fail(500, { message: 'Gagal mengunduh file naskah.' });
    }
  }
};
