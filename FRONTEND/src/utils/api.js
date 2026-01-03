import axios from 'axios';

const api = axios.create({
  baseURL: window.location.hostname === 'localhost'
    ? "http://localhost:8000"
    : "https://desipath-backend-api.azurewebsites.net", // Replace with your actual Azure URL
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized, redirecting to login...');
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
