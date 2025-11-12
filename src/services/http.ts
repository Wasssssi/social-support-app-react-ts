import axios, { type AxiosRequestHeaders } from 'axios';

export const http = axios.create({
	timeout: 15000,
});

http.interceptors.request.use((config) => {
	if (typeof config.url === 'string' && config.url.includes('api.openai.com')) {
		const key = (import.meta as any).env?.VITE_OPENAI_API_KEY as string | undefined;
		if (key && !config.headers?.Authorization) {
			config.headers = { ...(config.headers || {}), Authorization: `Bearer ${key}` } as AxiosRequestHeaders;
		}
	}
	return config;
});

http.interceptors.response.use(
	(resp) => resp,
	(error) => {
		if (error.code === 'ECONNABORTED') {
			return Promise.reject(new Error('Request timed out'));
		}
		if (error.response) {
			const msg = error.response.data?.error?.message || `HTTP ${error.response.status}`;
			return Promise.reject(new Error(msg));
		}
		return Promise.reject(error);
	},
);


