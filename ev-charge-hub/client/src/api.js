// client/src/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log the request for debugging
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
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          // You might want to differentiate between user and admin tokens here
          // If a general token covers both, this is fine.
          // If not, consider separate token storage for admin.
          window.location.href = '/login'; // Or '/admin/login' if distinct
          break;
        case 403:
          console.error('Access forbidden: You do not have permission to perform this action.');
          // Potentially redirect to a forbidden page or show a specific message
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

      // Return a more user-friendly error message
      const errorMessage = data?.message || `HTTP Error ${status}`;
      return Promise.reject(new Error(errorMessage));

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

// --- MODIFICATION START ---

// API endpoints object for better organization
export const endpoints = {
  // EV Bunks endpoints
  bunks: {
    getAll: '/api/bunks',           // GET all bunks
    getById: (id) => `/api/bunks/${id}`, // GET bunk by ID
    create: '/api/bunks',             // POST create bunk
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

  // Booking endpoints (if you have them)
  bookings: {
    create: '/api/bookings',
    getByUser: '/api/bookings/user',
    cancel: (id) => `/api/bookings/${id}/cancel`,
  },

  // --- NEW ADMIN ENDPOINTS ---
  admin: {
    // Admin Auth
    adminLogin: '/api/admin/login',
    adminRegister: '/api/admin/register', // If you have an admin registration endpoint
    adminProfile: '/api/admin/profile', // GET/PUT admin's own profile

    // User Management
    getAllUsers: '/api/admin/users', // GET all users (with optional search/filter params)
    searchUsers: '/api/admin/users/search', // GET search users by query
    getUserById: (id) => `/api/admin/users/${id}`, // GET a specific user's details
    getUserBookings: (id) => `/api/admin/users/${id}/bookings`, // GET a user's booking history
    updateUserStatus: (id) => `/api/admin/users/${id}/status`, // PUT update user status
    deleteUser: (id) => `/api/admin/users/${id}`, // DELETE a user
    
    // Dashboard & Analytics (if needed on frontend)
    getDashboardStats: '/api/admin/stats',
    getBookingAnalytics: '/api/admin/bookings/analytics',
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

  // --- NEW ADMIN API METHODS ---
  // User Management
  adminGetAllUsers: (statusFilter = 'all', sortBy = 'createdAt', sortOrder = 'desc', searchTerm = '') => {
    return api.get(endpoints.admin.getAllUsers, {
      params: { status: statusFilter, sortBy, sortOrder, q: searchTerm }
    });
  },
  adminSearchUsers: (query) => api.get(endpoints.admin.searchUsers, { params: { q: query } }),
  adminGetUserById: (id) => api.get(endpoints.admin.getUserById(id)),
  adminGetUserBookings: (userId) => api.get(endpoints.admin.getUserBookings(userId)),
  adminUpdateUserStatus: (userId, status) => api.put(endpoints.admin.updateUserStatus(userId), { status }),
  adminDeleteUser: (userId) => api.delete(endpoints.admin.deleteUser(userId)),

  // Admin Auth (if distinct from regular user auth)
  adminLogin: (credentials) => api.post(endpoints.admin.adminLogin, credentials),
  adminRegister: (data) => api.post(endpoints.admin.adminRegister, data),
  adminGetProfile: () => api.get(endpoints.admin.adminProfile),
  adminUpdateProfile: (data) => api.put(endpoints.admin.adminProfile, data),

  // Dashboard & Analytics
  adminGetDashboardStats: () => api.get(endpoints.admin.getDashboardStats),
  adminGetBookingAnalytics: () => api.get(endpoints.admin.getBookingAnalytics),

};

export default api;