// client/src/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000' || 'https://ev-charge-hub-server1.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors globally
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    console.log('Response data:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error);

    if (error.response) {
      const { status, data } = error.response;
      console.error(`HTTP Error ${status}:`, data);

      switch (status) {
        case 401:
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          console.error('Access forbidden: You do not have permission to perform this action.');
          break;
        case 404:
          console.error('API endpoint not found');
          break;
        case 500:
          console.error('Internal server error');
          break;
        default:
          console.error('Unexpected error status:', status);
      }

      const errorMessage = data?.message || `HTTP Error ${status}`;
      return Promise.reject(new Error(errorMessage));

    } else if (error.request) {
      console.error('No response received:', error.request);
      return Promise.reject(new Error('Cannot connect to server. Please check your internet connection.'));

    } else {
      console.error('Request setup error:', error.message);
      return Promise.reject(error);
    }
  }
);

// API endpoints object for better organization
export const endpoints = {
  // EV Bunks endpoints
  bunks: {
    getAll: '/api/bunks',
    getById: (id) => `/api/bunks/${id}`,
    create: '/api/bunks',
    update: (id) => `/api/bunks/${id}`,
    delete: (id) => `/api/bunks/${id}`,
    getAvailable: '/api/bunks/available',
    getNearby: '/api/bunks/nearby',
    search: '/api/bunks/search',
    getByConnector: '/api/bunks/connector',
  },

  // Auth endpoints
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    profile: '/api/auth/profile',
  },

  // Booking endpoints
  bookings: {
    create: '/api/bookings',
    getByUser: '/api/bookings/user',
    cancel: (id) => `/api/bookings/${id}/cancel`,
  },

  // Admin endpoints - FIXED TO MATCH BACKEND
  admin: {
    // Admin Auth
    adminLogin: '/api/admin/login',
    adminRegister: '/api/admin/register',
    adminProfile: '/api/admin/profile',

    // User Management - CORRECTED ENDPOINTS
    getAllUsers: '/api/admin/users',
    searchUsers: '/api/admin/users/search',
    getUserById: (id) => `/api/admin/users/${id}`, // This should match backend getUserById
    getUserBookings: (id) => `/api/admin/users/${id}/bookings`,
    updateUserStatus: (id) => `/api/admin/users/${id}/status`,
    deleteUser: (id) => `/api/admin/users/${id}`, // This should match backend deleteUser
    
    // Dashboard & Analytics
    getDashboardStats: '/api/admin/stats',
    getBookingAnalytics: '/api/admin/bookings/analytics',
  }
};

// FIXED: Convenience methods for common operations
export const apiMethods = {
  // Get all bunks
  getAllBunks: () => api.get(endpoints.bunks.getAll),

  // Get bunk by ID
  getBunkById: (id) => api.get(endpoints.bunks.getById(id)),

  // Get available bunks
  getAvailableBunks: () => api.get(endpoints.bunks.getAvailable),

  // Get nearby bunks
  getNearbyBunks: (lat, lng, radius = 10) =>
    api.get(endpoints.bunks.getNearby, {
      params: { latitude: lat, longitude: lng, radius }
    }),

  // Search bunks
  searchBunks: (query) =>
    api.get(endpoints.bunks.search, {
      params: { q: query }
    }),

  // Get bunks by connector type
  getBunksByConnector: (connectorType) =>
    api.get(endpoints.bunks.getByConnector, {
      params: { type: connectorType }
    }),

  // FIXED: Admin API methods to match backend implementation
  // User Management
  adminGetAllUsers: (statusFilter = 'all', sortBy = 'createdAt', sortOrder = 'desc', searchTerm = '') => {
    const params = {};
    if (statusFilter !== 'all') params.status = statusFilter;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    if (searchTerm) params.q = searchTerm;
    
    return api.get(endpoints.admin.getAllUsers, { params });
  },
  
  adminSearchUsers: (query) => api.get(endpoints.admin.searchUsers, { params: { q: query } }),
  
  adminGetUserById: (id) => api.get(endpoints.admin.getUserById(id)),
  
  adminGetUserBookings: (userId) => api.get(endpoints.admin.getUserBookings(userId)),
  
  // FIXED: This was the main issue - using correct parameter name
  adminUpdateUserStatus: (userId, status) => api.put(endpoints.admin.updateUserStatus(userId), { status }),
  
  // FIXED: Using correct endpoint and parameter name
  adminDeleteUser: (userId) => api.delete(endpoints.admin.deleteUser(userId)),

  // Admin Auth
  adminLogin: (credentials) => api.post(endpoints.admin.adminLogin, credentials),
  adminRegister: (data) => api.post(endpoints.admin.adminRegister, data),
  adminGetProfile: () => api.get(endpoints.admin.adminProfile),
  adminUpdateProfile: (data) => api.put(endpoints.admin.adminProfile, data),

  // Dashboard & Analytics
  adminGetDashboardStats: () => api.get(endpoints.admin.getDashboardStats),
  adminGetBookingAnalytics: (period = '30') => api.get(endpoints.admin.getBookingAnalytics, { params: { period } }),
};

export default api;