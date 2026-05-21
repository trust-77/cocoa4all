import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (username, email, password) =>
    api.post('/api/auth/register', {
      username,
      email,
      password,
    }),

  login: (username, password) =>
    api.post('/api/auth/login', {
      username,
      password,
    }),
};

export default api;
