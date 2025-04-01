import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('certichain_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle authentication errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('certichain_token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Auth service for handling authentication requests
export const authService = {
  registerOrganization: async (orgData) => {
    try {
      const { data } = await api.post('/auth/register', orgData);
      localStorage.setItem('certichain_token', data.token);
      return data.organization;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  },

  loginOrganization: async ({ email, password }) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('certichain_token', data.token);
      return data.organization;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  },

  logout: () => {
    localStorage.removeItem('certichain_token');
    window.location.href = '/';
  },

  getCurrentOrganization: async () => {
    const token = localStorage.getItem('certichain_token');
    if (!token) throw new Error('User not authenticated');

    try {
      const { data } = await api.get('/auth/me');
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Not authenticated');
    }
  }
};

// Certificate service for handling certificate-related operations
export const certificateService = {
  issueCertificate: async (certificateData) => {
    try {
      const { data } = await api.post('/certificates', certificateData);
      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || 'Failed to issue certificate. Please try again.'
      );
    }
  },

  verifyCertificate: async (certificateId) => {
    try {
      const { data } = await api.get(`/certificates/${certificateId}`);
      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || 'Certificate verification failed. Invalid or expired certificate.'
      );
    }
  },

  getOrganizationCertificates: async () => {
    try {
      const { data } = await api.get('/certificates');
      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || 'Failed to load certificates. Please try again later.'
      );
    }
  }
};

// Higher Order Component for protected routes
export const withAuth = (Component) => {
  return (props) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('certichain_token');

    useEffect(() => {
      if (!token) {
        navigate('/auth');
      }
    }, [token, navigate]);

    return token ? <Component {...props} /> : null;
  };
};