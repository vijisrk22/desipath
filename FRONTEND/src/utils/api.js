import axios from 'axios';

export const BASE_URL = window.location.hostname === 'localhost'
    ? "http://localhost:8000"
    : "https://desipathapi.azurewebsites.net"; // Corrected app name

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  config => {
    window.dispatchEvent(new CustomEvent('api-loading-start'));
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    window.dispatchEvent(new CustomEvent('api-loading-stop'));
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    window.dispatchEvent(new CustomEvent('api-loading-stop'));
    return response;
  },
  error => {
    window.dispatchEvent(new CustomEvent('api-loading-stop'));
    if (error.response?.status === 401) {
      console.warn('Unauthorized, redirecting to login...');
      localStorage.removeItem('access_token');
      // Only redirect if not on a guest-friendly page (home, services, or kids-class)
      const isGuestPage = window.location.pathname === '/' || 
                          window.location.pathname.startsWith('/services/') || 
                          window.location.pathname.startsWith('/kids-class');
      if (!isGuestPage) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
