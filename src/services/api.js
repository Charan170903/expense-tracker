import axios from 'axios';

// Use environment variable for API URL
// In development: http://localhost:5000/api
// In production: Your Render backend URL
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to attach token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Transaction Services
export const transactionService = {
    getAll: async () => {
        const response = await api.get('/transactions?limit=1000');
        return response.data.data;
    },

    create: async (transactionData) => {
        const response = await api.post('/transactions', transactionData);
        return response.data.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/transactions/${id}`);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/transactions/${id}`, data);
        return response.data.data;
    }
};

// Auth Services
export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    register: async (email, password) => {
        const response = await api.post('/auth/register', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },

    forgotPassword: async (email) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    resetPassword: async (email, code, password) => {
        const response = await api.post('/auth/reset-password', { email, code, password });
        return response.data;
    }
};

export default api;
