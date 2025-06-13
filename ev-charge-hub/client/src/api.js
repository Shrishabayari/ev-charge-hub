// client/src/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Centralized function to get auth token - same as in your component
const getAuthToken = () => {
  return localStorage.getItem('authToken') ||
         localStorage.getItem('token') ||
         localStorage.getItem('userToken') ||
         sessionStorage.getItem('authToken');
};

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout for deployed environment
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      // Ensure Bearer format is correct
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log the request for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      console.log('Token found:', token ? 'Yes' : 'No');
    }
    
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
    // Log successful response (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
      console.log('Response data:', response.data);
    }
    
    return response;
  },
  (error) => {
    // Enhanced error handling
    console.error('❌ API Error:', error);
    
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      console.error(`HTTP Error ${status}:`, data);
      
      // Handle specific error cases
      switch (status) {
        case 401:
          // Unauthorized - clear all possible tokens
          localStorage.removeItem('token');
          localStorage.removeItem('authToken');
          localStorage.removeItem('userToken');
          sessionStorage.removeItem('authToken');
          
          console.error('Authentication failed - tokens cleared');
          
          // Create a more descriptive error message
          const authError = new Error('Authentication failed. Please log in again.');
          authError.status = 401;
          authError.isAuthError = true;
          return Promise.reject(authError);
          
        case 403:
          const forbiddenError = new Error('Access forbidden. You don\'t have permission to access this resource.');
          forbiddenError.status = 403;
          return Promise.reject(forbiddenError);
          
        case 404:
          const notFoundError = new Error('API endpoint not found. Please check the URL.');
          notFoundError.status = 404;
          return Promise.reject(notFoundError);
          
        case 500:
          const serverError = new Error('Internal server error. Please try again later.');
          serverError.status = 500;
          return Promise.reject(serverError);
          
        default:
          const unexpectedError = new Error(data?.message || `HTTP Error ${status}`);
          unexpectedError.status = status;
          return Promise.reject(unexpectedError);
      }
      
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
      const networkError = new Error('Cannot connect to server. Please check your internet connection and try again.');
      networkError.isNetworkError = true;
      return Promise.reject(networkError);
      
    } else {
      // Something else happened
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
    verify: '/api/auth/verify', // Add token verification endpoint
  },
  
  // Admin endpoints
  admin: {
    users: '/api/admin/users',
    userById: (id) => `/api/admin/users/${id}`,
    userBookings: (id) => `/api/admin/users/${id}/bookings`,
    userStatus: (id) => `/api/admin/users/${id}/status`,
    searchUsers: '/api/admin/users/search',
    bookings: '/api/admin/bookings',
    bookingById: (id) => `/api/admin/bookings/${id}`,
    updateBookingStatus: (id) => `/api/admin/bookings/${id}/status`,
  },
  
  // Booking endpoints
  bookings: {
    getAll: '/api/bookings',
    create: '/api/bookings',
    getByUser: '/api/bookings/user',
    getById: (id) => `/api/bookings/${id}`,
    updateStatus: (id) => `/api/bookings/${id}/status`,
    cancel: (id) => `/api/bookings/${id}/cancel`,
  }
};

// Enhanced convenience methods for common operations
export const apiMethods = {
  // Auth methods
  verifyToken: () => api.get(endpoints.auth.verify),
  
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

  // Admin methods
  getAllUsers: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`${endpoints.admin.users}${queryString ? `?${queryString}` : ''}`);
  },
  
  getUserById: (id) => api.get(endpoints.admin.userById(id)),
  
  getUserBookings: (id) => api.get(endpoints.admin.userBookings(id)),
  
  updateUserStatus: (id, status) => 
    api.put(endpoints.admin.userStatus(id), { status }),
  
  deleteUser: (id) => api.delete(endpoints.admin.userById(id)),
  
  updateUser: (id, userData) => 
    api.put(endpoints.admin.userById(id), userData),
  
  searchUsers: (query) => 
    api.get(endpoints.admin.searchUsers, {
      params: { q: query }
    }),

  // Booking methods
  getAllBookings: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`${endpoints.admin.bookings}${queryString ? `?${queryString}` : ''}`);
  },
  
  getBookingById: (id) => api.get(endpoints.admin.bookingById(id)),
  
  updateBookingStatus: (id, status) => 
    api.patch(endpoints.admin.updateBookingStatus(id), { status }),
};

// Utility function to check if user is authenticated
export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};

// Utility function to handle auth errors
export const handleAuthError = (error) => {
  if (error.status === 401 || error.isAuthError) {
    // Clear all tokens
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userToken');
    sessionStorage.removeItem('authToken');
    
    // Redirect to login if not already there
    if (window.location.pathname !== '/login' && window.location.pathname !== '/admin/login') {
      const isAdminRoute = window.location.pathname.startsWith('/admin');
      window.location.href = isAdminRoute ? '/admin/login' : '/login';
    }
  }
};

export default api;