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
  timeout: 15000, // Increased timeout for better reliability
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken(); // Use the centralized function
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log the request for debugging
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    console.log('Token found:', token ? 'Yes' : 'No');
    
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
    // Log successful response
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    console.log('Response data:', response.data);
    
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
          
          // Don't auto-redirect in production, let component handle it
          console.error('Authentication failed - tokens cleared');
          break;
        case 403:
          console.error('Access forbidden');
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
      
      // Return the original error to let components handle it
      return Promise.reject(error);
      
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
      return Promise.reject(new Error('Cannot connect to server. Please check your internet connection.'));
      
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
    getAll: '/api/bunks',              // GET all bunks
    getById: (id) => `/api/bunks/${id}`, // GET bunk by ID
    create: '/api/bunks',              // POST create bunk
    update: (id) => `/api/bunks/${id}`, // PUT update bunk
    delete: (id) => `/api/bunks/${id}`, // DELETE bunk
    getAvailable: '/api/bunks/available', // GET available bunks
    getNearby: '/api/bunks/nearby',    // GET nearby bunks
    search: '/api/bunks/search',       // GET search bunks
    getByConnector: '/api/bunks/connector', // GET bunks by connector type
  },
  
  // Auth endpoints (if you have them)
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    profile: '/api/auth/profile',
  },
  
  // Booking endpoints
  bookings: {
    getAll: '/api/bookings',           // GET all bookings (admin)
    create: '/api/bookings',
    getByUser: '/api/bookings/user',
    getById: (id) => `/api/bookings/${id}`,
    updateStatus: (id) => `/api/bookings/${id}/status`,
    cancel: (id) => `/api/bookings/${id}/cancel`,
  }
};

// Convenience methods for common operations
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

  // Booking methods
  getAllBookings: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`${endpoints.bookings.getAll}${queryString ? `?${queryString}` : ''}`);
  },
  
  updateBookingStatus: (id, status) => 
    api.patch(endpoints.bookings.updateStatus(id), { status }),
};

export default api;