import axios from 'axios';

export const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
	baseURL: API_BASE_URL
});

export function setAuthToken(token: string | null) {
	if (token) {
		api.defaults.headers.common.Authorization = `Bearer ${token}`;
	} else {
		delete api.defaults.headers.common.Authorization;
	}
}

export default api;
