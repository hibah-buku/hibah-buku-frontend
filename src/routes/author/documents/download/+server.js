const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export async function GET({ url, cookies }) {
	const targetPath = url.searchParams.get('path');
	const fileName = url.searchParams.get('name') || 'download.pdf';

	if (!targetPath) {
		return new Response('Missing path parameter', { status: 400 });
	}

	const token = cookies.get('auth_token');

	// Tentukan URL backend (apakah file publik di /storage atau endpoint API terlindungi)
	let fetchUrl;
	if (targetPath.startsWith('/storage/')) {
		const rootBase = API_BASE.replace('/api', '');
		fetchUrl = `${rootBase}${targetPath}`;
	} else {
		fetchUrl = `${API_BASE}${targetPath}`;
	}

	const headers = {};
	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	try {
		const response = await fetch(fetchUrl, { headers });

		if (!response.ok) {
			return new Response(`Failed to fetch file from backend. Status: ${response.status}`, {
				status: response.status
			});
		}

		// Teruskan headers Content-Type dan pasang Content-Disposition untuk trigger download di browser
		const responseHeaders = new Headers();
		const contentType = response.headers.get('Content-Type');
		if (contentType) {
			responseHeaders.set('Content-Type', contentType);
		}
		responseHeaders.set('Content-Disposition', `attachment; filename="${fileName}"`);

		// Stream content naskah/dokumen ke client
		return new Response(response.body, {
			status: response.status,
			headers: responseHeaders
		});
	} catch (err) {
		console.error('Download proxy error:', err);
		return new Response('Internal server error while fetching file', { status: 500 });
	}
}
