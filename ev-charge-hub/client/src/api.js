// client/src/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
    const adminToken = localStorage.getItem('adminToken'); // Check for admin token too
    
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (token) {
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
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error);
    
    if (error.response) {
      const { status, data } = error.response;
      console.error(`HTTP Error ${status}:`, data);
      
      switch (status) {
        case 401:
          // Clear both tokens on 401
          localStorage.removeItem('token');
          localStorage.removeItem('adminToken');
          // Only redirect if not already on login page
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
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
  
  // Booking endpoints
  bookings: {
    getAll: '/api/bookings',                    // For admin: all bookings
    getByUser: '/api/bookings/user',           // For users: their bookings
    create: '/api/bookings/create',
    cancel: (id) => `/api/bookings/cancel/${id}`,
    reschedule: (id) => `/api/bookings/reschedule/${id}`,
    checkAvailability: '/api/bookings/check-availability',
    getAvailableSlots: (bunkId, date) => `/api/bookings/available-slots/${bunkId}/${date}`,
    // Admin-specific booking endpoints
    admin: {
      getAll: '/api/admin/bookings',
      getStats: '/api/admin/bookings/stats',
      getDetails: (id) => `/api/admin/bookings/${id}`,
      updateStatus: (id) => `/api/admin/bookings/${id}/status`,
    }
  },
  
  // Auth endpoints
  auth: {
    login: '/api/users/login',
    register: '/api/users/register',
    profile: '/api/users/profile',
  },
  
  // Admin endpoints
  admin: {
    login: '/api/admin/login',
    register: '/api/admin/register',
    profile: '/api/admin/profile',
    users: '/api/admin/users',
    stats: '/api/admin/stats',
  }
};

// Enhanced convenience methods
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

  // Booking operations
  getAllBookings: (page = 1, limit = 10) => {
    // Try admin endpoint first, fallback to regular endpoint
    const token = localStorage.getItem('token');
    if (token) {
      return api.get(endpoints.bookings.admin.getAll, {
        params: { page, limit }
      });
    }
    return api.get(endpoints.bookings.getAll, {
      params: { page, limit }
    });
  },
  
  getUserBookings: () => api.get(endpoints.bookings.getByUser),
  
  createBooking: (bookingData) => api.post(endpoints.bookings.create, bookingData),
  
  cancelBooking: (id) => api.put(endpoints.bookings.cancel(id)),
  
  rescheduleBooking: (id, newData) => api.put(endpoints.bookings.reschedule(id), newData),
  
  checkSlotAvailability: (data) => api.post(endpoints.bookings.checkAvailability, data),
  
  getAvailableSlots: (bunkId, date) => api.get(endpoints.bookings.getAvailableSlots(bunkId, date)),

  // Admin booking operations
  getBookingStats: () => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      return api.get(endpoints.bookings.admin.getStats);
    }
    throw new Error('Admin access required');
  },
  
  updateBookingStatus: (id, status) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      return api.patch(endpoints.bookings.admin.updateStatus(id), { status });
    }
    throw new Error('Admin access required');
  },

  // Auth operations
  login: (credentials) => api.post(endpoints.auth.login, credentials),
  register: (userData) => api.post(endpoints.auth.register, userData),
  getProfile: () => api.get(endpoints.auth.profile),
  
  // Admin auth operations
  adminLogin: (credentials) => api.post(endpoints.admin.login, credentials),
  adminRegister: (userData) => api.post(endpoints.admin.register, userData),
  getAdminProfile: () => api.get(endpoints.admin.profile),
};

export default api;