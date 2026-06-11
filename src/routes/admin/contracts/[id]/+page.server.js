import { apiGet } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';

export async function load({ params, cookies }) {
    const contractId = params.id;
    let contract = null;
    let error = null;

    try {
        // metadata kontrak
        const response = await apiGet(ENDPOINTS.CONTRACTS.SHOW(contractId), {}, { cookies });
        contract = response.data ?? response;
    } catch (err) {
        console.error('Failed to load contract details:', err);
        error = err?.data?.message || err?.message || 'Gagal memuat detail kontrak.';
    }

    return {
        contractId,
        contract,
        pdfFileName: contract?.file_info?.original_name || `contract-${contractId}.pdf`,
        error
    };
}