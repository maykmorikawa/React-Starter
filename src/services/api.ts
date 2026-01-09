import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: async (username: string, password: string) => {
        const response = await api.post('/auth/login', { username, password });
        return response.data;
    },

    verify: async (token: string) => {
        const response = await api.post('/auth/verify', { token });
        return response.data;
    },

    register: async (username: string, password: string) => {
        const response = await api.post('/auth/register', { username, password });
        return response.data;
    },
};

// Certificates API
export const certificatesAPI = {
    create: async (certificateData: {
        studentName: string;
        courseName: string;
        hours: number;
        issueDate: string;
    }) => {
        const response = await api.post('/certificates', certificateData);
        return response.data;
    },

    getAll: async (page = 1, limit = 10, search = '') => {
        const response = await api.get('/certificates', {
            params: { page, limit, search },
        });
        return response.data;
    },

    validate: async (certificateId: string) => {
        const response = await api.get(`/certificates/${certificateId}`);
        return response.data;
    },

    download: async (certificateId: string) => {
        const response = await api.get(`/certificates/${certificateId}/download`, {
            responseType: 'blob',
        });
        return response.data;
    },

    revoke: async (certificateId: string) => {
        const response = await api.delete(`/certificates/${certificateId}`);
        return response.data;
    },

    updateStatus: async (certificateId: string, status: 'active' | 'inactive') => {
        const response = await api.patch(`/certificates/${certificateId}/status`, { status });
        return response.data;
    },
};

export default api;
