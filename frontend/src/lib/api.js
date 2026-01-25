// API Client Configuration for Nexodify AVA
// Single source of truth for all backend API calls
import axios from 'axios';

// API Base URL - fallback to VM backend
export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ?? "https://api.nexodify.com";

const resolveApiUrl = (maybeRelativeUrl) => {
  if (!maybeRelativeUrl) return null;
  if (/^https?:\/\//i.test(maybeRelativeUrl)) return maybeRelativeUrl;
  return `${API_BASE_URL}${maybeRelativeUrl}`;
};

const sanitizeFilename = (value) =>
  String(value || 'report')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management helpers
export const getAuthToken = () => localStorage.getItem('ava_token');
export const setAuthToken = (token) => localStorage.setItem('ava_token', token);
export const removeAuthToken = () => localStorage.removeItem('ava_token');

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = getAuthToken();
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
      removeAuthToken();
      localStorage.removeItem('ava_auth');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// Health check
// GET /health
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

// Auth endpoints
export const authAPI = {
  // POST /auth/dev-login
  devLogin: async (email) => {
    const response = await api.post('/auth/dev-login', { email });
    return response.data;
  },
  
  // Legacy endpoints (kept for compatibility)
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
  // POST /api/run (multipart/form-data)
  create: async (formData) => {
    const response = await api.post('/api/run', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  // GET /api/runs
  list: async (params = {}) => {
    const response = await api.get('/api/runs', { params });
    return response.data;
  },

  // GET /api/runs (alias for consistency)
  listRuns: async (params = {}) => {
    const response = await api.get('/api/runs', { params });
    return response.data;
  },
  
  // GET /api/runs/:run_id/report.json
  getReport: async (runId) => {
    const response = await api.get(`/api/runs/${runId}/report.json`);
    return response.data;
  },

  // GET /api/runs/:run_id/report_view.json
  getReportView: async (runId) => {
    const response = await api.get(`/api/runs/${runId}/report_view.json`);
    return response.data;
  },
  
  // POST /api/runs/:run_id/corrections
  submitCorrections: async (runId, correctionsText, overrideFieldsJson = '{}') => {
    const response = await api.post(`/api/runs/${runId}/corrections`, {
      corrections_text: correctionsText,
      override_fields_json: overrideFieldsJson,
    });
    return response.data;
  },
  
  // DELETE /api/runs/:run_id
  delete: async (runId) => {
    const response = await api.delete(`/api/runs/${runId}`);
    return response.data;
  },
  
  // Get PDF URL
  getPdfUrl: (runId, pdfPath = null) => {
    if (pdfPath) {
      return `${API_BASE_URL}${pdfPath}`;
    }
    return `${API_BASE_URL}/api/runs/${runId}/report.pdf`;
  },
  
  // Download PDF as blob
  downloadPdf: async (runId, pdfPath = null) => {
    const url = pdfPath ? `/api/runs/${runId}${pdfPath}` : `/api/runs/${runId}/report.pdf`;
    const response = await api.get(url, { responseType: 'blob' });
    return response.data;
  },

  // Download Premium PDF with auth (triggers browser download)
  downloadPremiumPdf: async (runId) => {
    const resolved = `${API_BASE_URL}/api/runs/${runId}/report.pdf`;
    const cacheBuster = `t=${Date.now()}`;
    const url = resolved.includes('?') ? `${resolved}&${cacheBuster}` : `${resolved}?${cacheBuster}`;

    const response = await api.get(url, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    const blob = response.data;
    const safeId = sanitizeFilename(runId);
    const filename = `AVA_Preflight_${safeId}.pdf`;
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  },

  // GET /health
  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },
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

export default api;
