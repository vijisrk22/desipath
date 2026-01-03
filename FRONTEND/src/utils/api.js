import axios from 'axios';

const api = axios.create({
  // baseURL: "https://desipathdev.azurewebsites.net" //Backend server
  baseURL: "http://localhost:8000", //Backend server
  // "https://e67fc1b0-31f8-45d4-9a82-e2f5d5b1defe.mock.pstmn.io" // New Mock Server
  // "https://2a757f31-eee2-442d-b23e-133579e34a46.mock.pstmn.io", // Old Mock Server - 1000 API call limit reached (per month)
  // withCredentials: true
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if(token){
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
