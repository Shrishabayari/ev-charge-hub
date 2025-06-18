// client/src/api.js - Enhanced Debug Version
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout to 30s for deployed environments
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

    // Enhanced logging for debugging
    console.log(`🔄 API Request Details:`, {
      method: config.method?.toUpperCase(),
      url: `${config.baseURL}${config.url}`,
      headers: config.headers,
      data: config.data,
      params: config.params
    });
    
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
    console.error('❌ API Error Details:', {
      message: error.message,
      response: error.response,
      request: error.request,
      config: error.config
    });

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
      console.error('No response received:', {
        request: error.request,
        baseURL: API_BASE_URL,
        timeout: api.defaults.timeout
      });
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

  // Admin endpoints - CORRECTED TO MATCH BACKEND ROUTES
  admin: {
    // Admin Auth
    adminLogin: '/api/admin/login',
    adminRegister: '/api/admin/register',
    adminProfile: '/api/admin/profile',

    // User Management - CORRECTED ENDPOINTS
    getAllUsers: '/api/admin/users',
    searchUsers: '/api/admin/users/search',
    getUserById: (id) => `/api/admin/users/${id}`,
    getUserBookings: (id) => `/api/admin/users/${id}/bookings`,
    updateUserStatus: (id) => `/api/admin/users/${id}/status`,
    deleteUser: (id) => `/api/admin/users/${id}`,
    
    // Dashboard & Analytics
    getDashboardStats: '/api/admin/stats',
    getBookingAnalytics: '/api/admin/bookings/analytics',
  }
};

// Enhanced convenience methods with better error handling and debugging
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

  // ENHANCED: Admin API methods with better debugging
  // User Management
  adminGetAllUsers: (statusFilter = 'all', sortBy = 'createdAt', sortOrder = 'desc', searchTerm = '') => {
    const params = {};
    if (statusFilter !== 'all') params.status = statusFilter;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    if (searchTerm) params.q = searchTerm;
    
    console.log('🔍 adminGetAllUsers - Params:', params);
    return api.get(endpoints.admin.getAllUsers, { params });
  },
  
  adminSearchUsers: (query) => {
    console.log('🔍 adminSearchUsers - Query:', query);
    return api.get(endpoints.admin.searchUsers, { params: { q: query } });
  },
  
  adminGetUserById: (id) => {
    console.log('🔍 adminGetUserById - ID:', id);
    return api.get(endpoints.admin.getUserById(id));
  },
  
  adminGetUserBookings: (userId) => {
    console.log('🔍 adminGetUserBookings - UserID:', userId);
    return api.get(endpoints.admin.getUserBookings(userId));
  },
  
  // ENHANCED: With comprehensive logging and validation
  adminUpdateUserStatus: (userId, status) => {
    if (!userId || !status) {
      console.error('❌ adminUpdateUserStatus - Missing required parameters:', { userId, status });
      return Promise.reject(new Error('User ID and status are required'));
    }
    
    const payload = { status };
    const url = endpoints.admin.updateUserStatus(userId);
    
    console.log('🔄 adminUpdateUserStatus - Details:', {
      userId,
      status,
      url,
      payload,
      fullUrl: `${API_BASE_URL}${url}`
    });
    
    return api.put(url, payload)
      .then(response => {
        console.log('✅ adminUpdateUserStatus - Success:', response.data);
        return response;
      })
      .catch(error => {
        console.error('❌ adminUpdateUserStatus - Failed:', {
          userId,
          status,
          url,
          error: error.response?.data || error.message
        });
        throw error;
      });
  },
  
  // ENHANCED: With comprehensive logging and validation
  adminDeleteUser: (userId) => {
    if (!userId) {
      console.error('❌ adminDeleteUser - Missing user ID');
      return Promise.reject(new Error('User ID is required'));
    }
    
    const url = endpoints.admin.deleteUser(userId);
    
    console.log('🔄 adminDeleteUser - Details:', {
      userId,
      url,
      fullUrl: `${API_BASE_URL}${url}`
    });
    
    return api.delete(url)
      .then(response => {
        console.log('✅ adminDeleteUser - Success:', response.data);
        return response;
      })
      .catch(error => {
        console.error('❌ adminDeleteUser - Failed:', {
          userId,
          url,
          error: error.response?.data || error.message
        });
        throw error;
      });
  },

  // Admin Auth
  adminLogin: (credentials) => api.post(endpoints.admin.adminLogin, credentials),
  adminRegister: (data) => api.post(endpoints.admin.adminRegister, data),
  adminGetProfile: () => api.get(endpoints.admin.adminProfile),
  adminUpdateProfile: (data) => api.put(endpoints.admin.adminProfile, data),

  // Dashboard & Analytics
  adminGetDashboardStats: () => api.get(endpoints.admin.getDashboardStats),
  adminGetBookingAnalytics: (period = '30') => 
    api.get(endpoints.admin.getBookingAnalytics, { params: { period } }),

  // Additional convenience methods
  adminGetUserStats: (userId) => api.get(`/api/admin/users/${userId}/stats`),
};

// Debug helper to check environment and configuration
export const debugInfo = () => {
  console.log('🐛 API Configuration Debug Info:', {
    API_BASE_URL,
    environment: process.env.NODE_ENV,
    reactAppApiUrl: process.env.REACT_APP_API_URL,
    timeout: api.defaults.timeout,
    headers: api.defaults.headers
  });
};

// Call debug info on load in development
if (process.env.NODE_ENV === 'development') {
  debugInfo();
}

// Export default api instance
export default api;