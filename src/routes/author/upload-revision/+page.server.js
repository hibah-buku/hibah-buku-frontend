import { apiGet } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';

export const load = async (event) => {
    try {
        const response = await apiGet(ENDPOINTS.MANUSCRIPTS.MY_MANUSCRIPT, {}, event);
        const manuscripts = response.data?.data ?? [];
        // Ambil naskah yang statusnya revision_needed
        const revisionManuscripts = manuscripts.filter(m => m.status.code === 'revision_needed');
        return {
            manuscripts: revisionManuscripts,
            allManuscripts: manuscripts
        };
    } catch (err) {
        if (err.status === 404) {
            return { manuscripts: [], allManuscripts: [] };
        }
        console.error('Gagal mengambil data naskah:', err);
        return { manuscripts: [], allManuscripts: [] };
    }
};