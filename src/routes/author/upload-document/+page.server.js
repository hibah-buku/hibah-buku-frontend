import { fail, redirect } from '@sveltejs/kit';
import { apiGet, apiDelete } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export async function load({ cookies }) {
	const token = cookies.get('auth_token');
	if (!token) {
		throw redirect(303, '/login');
	}

	try {
		const response = await apiGet(ENDPOINTS.AUTHOR_DOCUMENTS.INDEX, {}, { cookies });
		return {
			documents: response.data ?? [],
			error: null
		};
	} catch (error) {
		if (error.status === 404) {
			return {
				documents: [],
				error: null
			};
		}
		console.error('Failed to load author documents:', error);
		return {
			documents: [],
			error: 'Gagal memuat dokumen kelengkapan.'
		};
	}
}

export const actions = {
	upload: async ({ request, cookies }) => {
		const token = cookies.get('auth_token');
		if (!token) {
			throw redirect(303, '/login');
		}

		const formData = await request.formData();
		const file = formData.get('document_file');
		const type = formData.get('document_type');

		if (!type || !['surat_pernyataan', 'scan_bermeterai', 'dokumen_pendukung'].includes(type)) {
			return fail(400, {
				success: false,
				message: 'Jenis dokumen tidak valid.'
			});
		}

		if (!file || file.size === 0) {
			return fail(400, {
				success: false,
				message: 'Berkas dokumen wajib dipilih.'
			});
		}

		const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];
		const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
		if (!allowedExtensions.includes(fileExtension)) {
			return fail(400, {
				success: false,
				message: 'Format berkas harus berupa PDF, JPG, JPEG, atau PNG.'
			});
		}

		const maxSize = 5 * 1024 * 1024; // 5MB
		if (file.size > maxSize) {
			return fail(400, {
				success: false,
				message: 'Ukuran berkas maksimal adalah 5 MB.'
			});
		}

		try {
			const response = await fetch(`${API_BASE}${ENDPOINTS.AUTHOR_DOCUMENTS.UPLOAD}`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: formData
			});

			const resData = await response.json();

			if (!response.ok) {
				return fail(response.status, {
					success: false,
					message: resData.message || 'Gagal mengunggah dokumen.'
				});
			}

			return {
				success: true,
				message: 'Dokumen berhasil diunggah.'
			};
		} catch (error) {
			console.error('Failed to upload document:', error);
			return fail(500, {
				success: false,
				message: 'Gagal mengunggah berkas ke server.'
			});
		}
	},

	delete: async ({ request, cookies }) => {
		const token = cookies.get('auth_token');
		if (!token) {
			throw redirect(303, '/login');
		}

		const formData = await request.formData();
		const type = formData.get('document_type');

		if (!type) {
			return fail(400, {
				success: false,
				message: 'Jenis dokumen wajib ditentukan.'
			});
		}

		try {
			await apiDelete(ENDPOINTS.AUTHOR_DOCUMENTS.DESTROY(type), {}, { cookies });
			return {
				success: true,
				message: 'Dokumen berhasil dihapus.'
			};
		} catch (error) {
			console.error('Failed to delete document:', error);
			return fail(error.status || 500, {
				success: false,
				message: error.message || 'Gagal menghapus dokumen.'
			});
		}
	}
};
