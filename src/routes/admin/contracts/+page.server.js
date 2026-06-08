import { apiGet } from '$lib/api/client.js';
import { ENDPOINTS } from '$lib/api/endpoint.js';

export async function load({ cookies, url }) {
	const token = cookies.get('auth_token');

	// Ambil parameter filter dari URL
	const search = url.searchParams.get('search') || '';
	const status = url.searchParams.get('status') || ''; // Misal: contract_uploaded, contract_validated
	const page = url.searchParams.get('page') || '1';

	if (!token) {
		return { 
            contracts: [], 
            meta: null, 
            filters: { search, status, page } 
        };
	}

	try {
		const response = await apiGet(
			ENDPOINTS.CONTRACTS.INDEX, // Pastikan endpoint ini ada di config Anda
			{ search, status, page },
			{ cookies }
		);

		const payload = response.data ?? {};

		return {
			contracts: payload.items ?? [], // Array data kontrak
			meta: payload.meta ?? {},       // Metadata pagination
			filters: { search, status, page },
			error: null
		};
	} catch (error) {
		console.error('Failed to load contracts:', error);
		return {
			contracts: [],
			meta: null,
			filters: { search, status, page },
			error: 'Gagal memuat data kontrak.'
		};
	}
}