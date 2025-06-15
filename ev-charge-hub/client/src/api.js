// client/src/api.js
import axios from 'axios';

// Base URL for the API. Uses environment variable or falls back to localhost.
// Make sure REACT_APP_API_URL is set to 'https://ev-charge-hub-server1.onrender.com' in your client's .env file for production.
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Adds Authorization header with token if available.
// Prioritizes 'adminToken' over generic 'token'.
api.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
    const userToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    // Attach the admin token if it exists, otherwise attach the generic user token
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }
    
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor: Handles responses and errors globally.
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error);
    
    if (error.response) {
      const { status, data } = error.response;
      console.error(`HTTP Error ${status}:`, data);
      
      switch (status) {
        case 401:
          // Unauthorized: Clear all tokens and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('adminToken');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('adminToken');
          
          // Only redirect if not already on a login page to prevent infinite redirects
          if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/admin/login')) {
            // Decide where to redirect based on context, here it's generic login
            window.location.href = '/login'; 
          }
          break;
        case 403:
          console.error('Access forbidden: You do not have permission to perform this action.');
          break;
        case 404:
          console.error('API endpoint not found. Check the URL and backend routes.');
          break;
        case 500:
          console.error('Internal server error: The server encountered an unexpected condition.');
          break;
        default:
          console.error('Unexpected error status:', status);
      }
      
      const errorMessage = data?.message || `HTTP Error ${status}: An unexpected error occurred.`;
      return Promise.reject(new Error(errorMessage));
      
    } else if (error.request) {
      // The request was made but no response was received (e.g., network error)
      console.error('No response received from server:', error.request);
      return Promise.reject(new Error('Cannot connect to server. Please check your internet connection.'));
    } else {
      // Something happened in setting up the request that triggered an Error
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
    getAvailable: '/api/bunks/available', // Example, adjust if needed
    getNearby: '/api/bunks/nearby',     // Example, adjust if needed
    search: '/api/bunks/search',        // Example, adjust if needed
    getByConnector: '/api/bunks/connector', // Example, adjust if needed
  },
  
  // Booking endpoints
  bookings: {
    // User-facing (non-admin) booking endpoints
    getByBunk: (bunkId) => `/api/bookings/bunk/${bunkId}`,
    checkAvailability: '/api/bookings/check-availability',
    getAvailableSlots: (bunkId, date) => `/api/bookings/available-slots/${bunkId}/${date}`,
    create: '/api/bookings/create',
    getByUser: '/api/bookings/user', 
    cancel: (id) => `/api/bookings/cancel/${id}`,
    reschedule: (id) => `/api/bookings/reschedule/${id}`,

    // Admin-specific booking endpoints - CORRECTED PATHS
    admin: {
      getAll: '/api/bookings/', // CORRECTED: Matches backend route
      getStats: '/api/bookings/admin/stats', // CORRECTED: Matches backend route
      getDetails: (id) => `/api/bookings/admin/${id}`, // CORRECTED: Matches backend route
      updateStatus: (id) => `/api/bookings/admin/${id}/status`, // CORRECTED: Matches backend route
    }
  },
  
  // Auth endpoints (for regular users)
  auth: {
    login: '/api/users/login',
    register: '/api/users/register',
    profile: '/api/users/profile',
  },
  
  // Admin-specific endpoints (for admin users)
  admin: {
    login: '/api/admin/login',
    register: '/api/admin/register',
    profile: '/api/admin/profile',
    users: '/api/admin/users',
    stats: '/api/admin/stats', // General admin stats
  }
};

// Enhanced convenience methods for making API calls
export const apiMethods = {
  // Bunk operations
  getAllBunks: () => api.get(endpoints.bunks.getAll),
  getBunkById: (id) => api.get(endpoints.bunks.getById(id)),
  getAvailableBunks: () => api.get(endpoints.bunks.getAvailable),
  getNearbyBunks: (lat, lng, radius = 10) => 
    api.get(endpoints.bunks.getNearby, {
      params: { latitude: lat, longitude: lng, radius }
    }),
  searchBunks: (query) => 
    api.get(endpoints.bunks.search, {
      params: { q: query }
    }),
  getBunksByConnector: (connectorType) =>
    api.get(endpoints.bunks.getByConnector, {
      params: { type: connectorType }
    }),

  // Booking operations (user-facing)
  getUserBookings: () => api.get(endpoints.bookings.getByUser),
  createBooking: (bookingData) => api.post(endpoints.bookings.create, bookingData),
  cancelBooking: (id) => api.put(endpoints.bookings.cancel(id)),
  rescheduleBooking: (id, newData) => api.put(endpoints.bookings.reschedule(id), newData),
  checkSlotAvailability: (data) => api.post(endpoints.bookings.checkAvailability, data),
  getAvailableSlots: (bunkId, date) => api.get(endpoints.bookings.getAvailableSlots(bunkId, date)),

  // Admin-specific booking operations - ALWAYS target admin endpoints
  getAllAdminBookings: (page = 1, limit = 10, filters = {}) => {
    const params = { page, limit, ...filters };
    return api.get(endpoints.bookings.admin.getAll, { params });
  },
  getAdminBookingDetails: (id) => api.get(endpoints.bookings.admin.getDetails(id)), // ADDED
  getAdminBookingStats: () => api.get(endpoints.bookings.admin.getStats), // Renamed for clarity
  updateAdminBookingStatus: (id, status) => api.patch(endpoints.bookings.admin.updateStatus(id), { status }), // Renamed for clarity

  // Auth operations (for regular users)
  login: (credentials) => api.post(endpoints.auth.login, credentials),
  register: (userData) => api.post(endpoints.auth.register, userData),
  getProfile: () => api.get(endpoints.auth.profile),
  
  // Admin auth operations
  adminLogin: (credentials) => api.post(endpoints.admin.login, credentials),
  adminRegister: (userData) => api.post(endpoints.admin.register, userData),
  getAdminProfile: () => api.get(endpoints.admin.profile),
};

export default api;