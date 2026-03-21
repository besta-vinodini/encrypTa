import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Attach userId header to every request if logged in
API.interceptors.request.use((config) => {
  const userId = localStorage.getItem('userId');
  if (userId) config.headers['X-User-Id'] = userId;
  return config;
});

// ── Auth ────────────────────────────────────────
export const registerUser   = (data) => API.post('/users/register', data);
export const loginUser      = (data) => API.post('/users/login', data);
export const verifyPassword = (userId, password) => API.post('/users/verify-password', { userId, password });

// ── Passwords ───────────────────────────────────
export const addPassword          = (data)   => API.post('/passwords', data);
export const getPasswordsByUser   = (userId) => API.get(`/passwords/user/${userId}`);
export const deletePassword       = (id)     => API.delete(`/passwords/${id}`);
export const updatePassword       = (id, data) => API.put(`/passwords/${id}`, data);
export const getDecryptedPassword = (id)     => API.get(`/passwords/${id}/decrypt`);
