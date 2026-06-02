import { fail, error } from '@sveltejs/kit';
import { apiGet, apiPatch } from '$lib/api/client';
import { ENDPOINTS } from '$lib/api/endpoint';

export async function load({ params, cookies }) {
	try {
		const response = await apiGet(
			ENDPOINTS.WILLINGNESS.SHOW(params.id),
			{},
			{ cookies }
		);

		return {
			form: response.data
		};
	} catch (err) {
		console.error(err);

		throw error(404, 'Formulir tidak ditemukan');
	}
}

export const actions = {
	approve: async ({ params, cookies }) => {
		try {
			const result = await apiPatch(
				ENDPOINTS.WILLINGNESS.APPROVE(params.id),
				{},
				{},
				{ cookies }
			);

			return {
				success: true,
				message: result.message
			};
		} catch (errorData) {
			return fail(errorData.status || 500, {
				message:
					errorData?.data?.message ||
					'Gagal menyetujui formulir'
			});
		}
	},

	reject: async ({ params, cookies }) => {
		try {
			const result = await apiPatch(
				ENDPOINTS.WILLINGNESS.REJECT(params.id),
				{
					rejection_reason: 'Ditolak oleh admin'
				},
				{},
				{ cookies }
			);

			return {
				success: true,
				message: result.message
			};
		} catch (errorData) {
			return fail(errorData.status || 500, {
				message:
					errorData?.data?.message ||
					'Gagal menolak formulir'
			});
		}
	}
};