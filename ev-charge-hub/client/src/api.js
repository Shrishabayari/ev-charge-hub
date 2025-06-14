// client/src/api.js - CORRECTED VERSION
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
    const userToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    
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

// Response interceptor
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
          localStorage.removeItem('token');
          localStorage.removeItem('adminToken');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('adminToken');
          
          if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/admin/login')) {
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
      console.error('No response received from server:', error.request);
      return Promise.reject(new Error('Cannot connect to server. Please check your internet connection.'));
    } else {
      console.error('Request setup error:', error.message);
      return Promise.reject(error);
    }
  }
);

// CORRECTED API endpoints - try multiple possible backend routes
export const endpoints = {
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
  
  bookings: {
    // User-facing booking endpoints
    getByBunk: (bunkId) => `/api/bookings/bunk/${bunkId}`,
    checkAvailability: '/api/bookings/check-availability',
    getAvailableSlots: (bunkId, date) => `/api/bookings/available-slots/${bunkId}/${date}`,
    create: '/api/bookings/create',
    getByUser: '/api/bookings/user', 
    cancel: (id) => `/api/bookings/cancel/${id}`,
    reschedule: (id) => `/api/bookings/reschedule/${id}`,

    // CORRECTED: Try common admin booking route patterns
    admin: {
      // Try these different possible routes your backend might be using:
      getAll: '/api/bookings', // Most common - all bookings (admin gets all by default)
      // Alternative routes to try if above fails:
      // getAll: '/api/admin/bookings', 
      // getAll: '/api/bookings/all',
      // getAll: '/api/bookings/admin',
      
      getStats: '/api/bookings/stats',
      getDetails: (id) => `/api/bookings/${id}`,
      updateStatus: (id) => `/api/bookings/${id}/status`,
    }
  },
  
  auth: {
    login: '/api/users/login',
    register: '/api/users/register',
    profile: '/api/users/profile',
  },
  
  admin: {
    login: '/api/admin/login',
    register: '/api/admin/register',
    profile: '/api/admin/profile',
    users: '/api/admin/users',
    stats: '/api/admin/stats',
  }
};

// Enhanced API methods with fallback route attempts
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

  // ENHANCED: Admin booking operations with fallback attempts
  getAllAdminBookings: async (page = 1, limit = 10, filters = {}) => {
    const params = { page, limit, ...filters };
    
    // List of possible routes your backend might be using
    const possibleRoutes = [
      '/api/bookings',           // Most common - admin gets all bookings
      '/api/admin/bookings',     // Admin-prefixed route
      '/api/bookings/all',       // Explicit 'all' route
      '/api/bookings/admin',     // Admin suffix
      '/api/bookings/admin/all', // Your original route
    ];
    
    // Try each route until one works
    for (const route of possibleRoutes) {
      try {
        console.log(`🔄 Trying admin bookings route: ${route}`);
        const response = await api.get(route, { params });
        console.log(`✅ Successfully fetched admin bookings from: ${route}`);
        return response;
      } catch (error) {
        if (error.response?.status === 404) {
          console.log(`❌ Route not found: ${route}, trying next...`);
          continue; // Try next route
        } else {
          // If it's not a 404, it's a different error (auth, server, etc)
          console.error(`❌ Error with route ${route}:`, error.message);
          throw error; // Re-throw non-404 errors
        }
      }
    }
    
    // If all routes failed
    throw new Error('No valid admin bookings endpoint found. Please check your backend routes.');
  },
  
  getAdminBookingDetails: (id) => api.get(endpoints.bookings.admin.getDetails(id)),
  getAdminBookingStats: () => api.get(endpoints.bookings.admin.getStats),
  updateAdminBookingStatus: (id, status) => api.patch(endpoints.bookings.admin.updateStatus(id), { status }),

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