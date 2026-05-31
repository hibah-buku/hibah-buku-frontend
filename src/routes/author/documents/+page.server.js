import { apiGet } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';

export const load = async (event) => {
    try {
        const response = await apiGet(ENDPOINTS.AUTHOR_DOCUMENTS.INDEX, {}, event);
        return {
            documents: response.data ?? []
        };
    } catch (err) {
        // 404 = belum punya naskah, bukan error fatal
        if (err.status === 404) {
            return { documents: [] };
        }
        console.error('Gagal mengambil dokumen:', err);
        return { documents: [] };
    }
};