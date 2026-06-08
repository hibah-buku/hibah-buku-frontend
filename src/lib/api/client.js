const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Fungsi dasar untuk melakukan request ke API Laravel
 * @param {string} endpoint - Path endpoint relatif, misalnya: '/users'
 * @param {object} options - Opsi fetch standar, seperti method, headers, body
 * @param {{ cookies?: import('@sveltejs/kit').Cookies }} event - Event/cookies dari SvelteKit server
 */
async function apiFetch(endpoint, options = {}, event) {
	const url = `${API_BASE}${endpoint}`;

	const defaultHeaders = {
		'Content-Type': 'application/json',
		Accept: 'application/json'
	};

	const headers = {
		...defaultHeaders,
		...options.headers
	};

	if (event && event.cookies) {
		const token = event.cookies.get('auth_token');

		if (token) {
			headers.Authorization = `Bearer ${token}`;
		}
	}

	try {
		const response = await fetch(url, {
			...options,
			headers
		});

		if (!response.ok) {
			let errorData = {};

			try {
				errorData = await response.json();
			} catch {
				errorData = {
					message: 'Network error or invalid JSON'
				};
			}

			throw {
				status: response.status,
				data: errorData,
				message: errorData.message || `HTTP error: ${response.status}`
			};
		}

		return await response.json();
	} catch (error) {
		console.error(`[API CLIENT] Error Fetching ${url} :`, error);
		throw error;
	}
}

/**
 * GET request dengan query params opsional
 * @param {string} endpoint
 * @param {Record<string, string | number | undefined | null>} params
 * @param {{ cookies?: import('@sveltejs/kit').Cookies }} event
 */
export async function apiGet(endpoint, params = {}, event) {
	const searchParams = new URLSearchParams();

	for (const [key, value] of Object.entries(params)) {
		if (value !== '' && value != null) {
			searchParams.set(key, String(value));
		}
	}

	const query = searchParams.toString();
	const url = query ? `${endpoint}?${query}` : endpoint;

	return await apiFetch(
		url,
		{
			method: 'GET'
		},
		event
	);
}

/**
 * POST request
 * Digunakan untuk create data, seperti tambah user.
 * @param {string} endpoint
 * @param {object} data
 * @param {{ cookies?: import('@sveltejs/kit').Cookies }} event
 * @param {object} [options]
 */
export async function apiPost(endpoint, data, options = {}, event) {
    return apiFetch(
        endpoint,
        {
            method: 'POST',
            body: JSON.stringify(data),
            ...options,
        },
        event
    );
}

/**
 * PATCH request
 * Digunakan untuk update data, seperti edit user.
 * @param {string} endpoint
 * @param {object} data
 * @param {{ cookies?: import('@sveltejs/kit').Cookies }} event
 * @param {object} [options]
 */
export async function apiPatch(endpoint, data, options = {}, event) {
    return apiFetch(
        endpoint,
        {
            method: 'PATCH',
            body: JSON.stringify(data),
            ...options,
        },
        event
    );
}

/**
 * DELETE request
 * Digunakan untuk hapus data.
 * @param {string} endpoint
 * @param {{ cookies?: import('@sveltejs/kit').Cookies }} event
 */
export async function apiDelete(endpoint, options = {}, event) {
    return apiFetch(
        endpoint,
        {
            method: 'DELETE',
            ...options,
        },
        event
    );
}
