const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';


/**
 * Fungsi dasar untuk melakukan request ke API Laravel
 * @param {string} endpoint - Path endpoint relatif (misal: '/users')
 * @param {object} options - Opsi fetch standar (method, headers, body, dll)
 */
async function apiFetch(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;

    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    const headers = {
        ...defaultHeaders,
        ...options.headers,
    };

    try {
        const response = await fetch(url,{
            ...options,
            headers,
        });

        if (!response.ok) {
            let errorData = {}
            
            try {                
                errorData = await response.json();
            } catch (error) {
                errorData = { message: 'Network error or invalid JSON'};
            }

            throw {
                status: response.status,
                data: errorData,
                message: errorData.message || `HTTP error: ${response.stataus}`
            };
        }

        return await response.json();

    } catch (error) {
        console.error(`[API CLIENT] Error Fetching ${url} :`, error);
        throw error;
    }
}

/**
 *  GET request
 */

export async function apiGet(endpoint, options = {}) {
    return await apiFetch(endpoint, {
        method: 'GET',
        ...options,
    });
}

/**
 * Helper khusus untuk POST request
 * @param {string} endpoint 
 * @param {object} data - Object payload yang akan di-JSON.stringify
 */
export async function apiPost(endpoint, data, options = {}) {
    return await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
        ...options,
    });
}

/**
 * Helper khusus untuk PATCH/PUT request
 */
export async function apiPatch(endpoint, data, options = {}) {
  return apiFetch(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
    ...options,
  });
}

/**
 * Helper khusus untuk DELETE request
 */
export async function apiDelete(endpoint, options = {}) {
  return apiFetch(endpoint, {
    method: 'DELETE',
    ...options,
  });
}