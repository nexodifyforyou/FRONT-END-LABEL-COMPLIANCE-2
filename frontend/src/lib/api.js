// API Client Configuration for Nexodify AVA
// Configure the backend URL to your Node/Express server
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'https://api.nexodify.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ava_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ava_token');
      localStorage.removeItem('ava_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  verifyEmail: (token) => api.post('/api/auth/verify-email', { token }),
  forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/api/auth/reset-password', data),
  me: () => api.get('/api/me'),
  logout: () => api.post('/api/auth/logout'),
};

// Run endpoints
export const runAPI = {
  create: (formData) => api.post('/api/run', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  list: (params) => api.get('/api/runs', { params }),
  get: (runId) => api.get(`/api/runs/${runId}`),
  downloadPdf: (runId) => `${API_BASE_URL}/api/runs/${runId}/report.pdf`,
  downloadJson: (runId) => `${API_BASE_URL}/api/runs/${runId}/report.json`,
  saveCorrection: (runId, correctionText) => 
    api.post('/api/save-corrections', { run_id: runId, correction_text: correctionText }),
  rerun: (runId, correctionText) => 
    api.post(`/api/runs/${runId}/rerun`, { correction_text: correctionText }),
};

// Billing endpoints
export const billingAPI = {
  getPlans: () => api.get('/api/billing/plans'),
  getWallet: () => api.get('/api/billing/wallet'),
  getLedger: (params) => api.get('/api/billing/ledger', { params }),
  createCheckoutSession: (priceId) => api.post('/api/billing/checkout', { price_id: priceId }),
  createPortalSession: () => api.post('/api/billing/portal'),
  topUp: (amount) => api.post('/api/billing/topup', { amount }),
};

// Admin endpoints (protected)
export const adminAPI = {
  grantCredits: (userId, credits, reason) => 
    api.post('/api/admin/grant-credits', { user_id: userId, credits, reason }),
  getUsers: (params) => api.get('/api/admin/users', { params }),
  getStats: () => api.get('/api/admin/stats'),
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;
