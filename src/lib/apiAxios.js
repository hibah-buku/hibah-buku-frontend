import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const apiAxios = axios.create({
	baseURL: API_BASE_URL
});

apiAxios.interceptors.request.use((config) => {
    if (typeof document !== 'undefined') {
        const match = document.cookie.match(new RegExp('(^| )auth_token=([^;]+)'));
        if (match) {
            config.headers.Authorization = `Bearer ${match[2]}`;
        }
    }
    return config;
});

export function setAuthToken(token) {
    // Token automatically handled by interceptor
}

export default apiAxios;
