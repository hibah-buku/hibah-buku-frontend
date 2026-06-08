import { fail } from '@sveltejs/kit';
import { apiPost } from '$lib/api/client.js';      
import { ENDPOINTS } from '$lib/api/endpoint.js'; 

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const payload = Object.fromEntries(data);

    try {
      const response = await apiPost(ENDPOINTS.WILLINGNESS.SUBMIT, payload);

      return { success: true };

    } catch (err) {
      console.error('API Error:', err);

      let validationErrors;

      // Handle error validasi
      if (err.status === 422) {
        validationErrors = err.data?.errors || err.errors || err.data || {};

        if (typeof validationErrors !== 'object' || Array.isArray(validationErrors)) {
            validationErrors = { general: [typeof validationErrors === 'string' ? validationErrors : JSON.stringify(validationErrors)] };
        }

      } else {
            validationErrors = {general: [err.data?.message || 'Terjadi kesalahan server' ]};
      }

      return fail(err.status || 500, {
        errors: validationErrors
      });
    }
  }
};