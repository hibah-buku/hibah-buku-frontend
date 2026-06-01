import { apiGet } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';

export const load = async (event) => {
    try {
        const response = await apiGet(ENDPOINTS.MANUSCRIPTS.MY_MANUSCRIPT, {}, event);
        return {
            manuscripts: response.data ?? []
        };
    } catch (err) {
        if (err.status === 404) {
            return { manuscripts: [] };
        }
        console.error('Gagal mengambil riwayat draft:', err);
        return { manuscripts: [] };
    }
};