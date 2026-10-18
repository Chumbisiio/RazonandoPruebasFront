import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
});

api.interceptors.request.use((config) => {
  const requestPath = config.url?.split('?')[0].replace(/\/+$/, '').toLowerCase() || '';
  const isPublicAuthRequest = ['/auth/login', '/auth/register'].some((path) =>
    requestPath.endsWith(path),
  );

  if (isPublicAuthRequest) {
    delete config.headers.Authorization;
    return config;
  }

  const token = localStorage.getItem('token');
  if (token) {
    const typeToken = localStorage.getItem('typeToken') || 'Bearer';
    config.headers.Authorization = `${typeToken} ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default api;
