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
    // Check for admin token first, then regular token
    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('token') || localStorage.getItem('authToken');
    
    // Use admin token for admin routes, regular token for others
    if (config.url.includes('/admin/') && adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (adminToken && (config.url.includes('/bookings') || config.url.includes('/stats'))) {
      // For booking routes that require admin access, use admin token
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }

    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    console.log('Headers:', config.headers);
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
          // Handle admin vs user authentication
          if (error.config.url.includes('/admin/') || 
              error.config.url.includes('/bookings') || 
              error.config.url.includes('/stats')) {
            console.error('Admin authentication failed');
            localStorage.removeItem('adminToken');
            localStorage.removeItem('token');
            localStorage.removeItem('authToken');
            window.location.href = '/admin/login';
          } else {
            console.error('User authentication failed');
            localStorage.removeItem('token');
            localStorage.removeItem('authToken');
            window.location.href = '/login';
          }
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

  // Booking endpoints (User & Admin)
  bookings: {
    // User booking endpoints
    create: '/api/bookings/create',
    getByUser: '/api/bookings/user',
    cancel: (id) => `/api/bookings/cancel/${id}`,
    reschedule: (id) => `/api/bookings/reschedule/${id}`,
    checkAvailability: '/api/bookings/check-availability',
    getAvailableSlots: (bunkId, date) => `/api/bookings/available-slots/${bunkId}/${date}`,
    
    // Admin booking endpoints - CORRECTED TO MATCH BACKEND ROUTES
    getAll: '/api/bookings', // Admin-only route (protectAdmin middleware)
    getById: (id) => `/api/bookings/${id}`, // Admin-only route (protectAdmin middleware)
    updateStatus: (id) => `/api/bookings/${id}/status`, // Admin-only route (protectAdmin middleware)
    getStats: '/api/bookings/stats', // Admin-only route (protectAdmin middleware)
  },

  // Admin endpoints
  admin: {
    // Admin Auth
    adminLogin: '/api/admin/login',
    adminRegister: '/api/admin/register',
    adminProfile: '/api/admin/profile',

    // User Management
    getAllUsers: '/api/admin/users',
    searchUsers: '/api/admin/users/search',
    getUserById: (id) => `/api/admin/users/${id}`,
    getUserBookings: (id) => `/api/admin/users/${id}/bookings`,
    updateUserStatus: (id) => `/api/admin/users/${id}/status`,
    deleteUser: (id) => `/api/admin/users/${id}`,
    
    // EV Bunks Management
    getAllBunks: '/api/admin/ev-bunks',
    getBunkById: (id) => `/api/admin/ev-bunks/${id}`,
    createBunk: '/api/admin/ev-bunks',
    updateBunk: (id) => `/api/admin/ev-bunks/${id}`,
    deleteBunk: (id) => `/api/admin/ev-bunks/${id}`,
    
    // Dashboard & Analytics
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

  // User Booking Methods
  createBooking: (bookingData) => api.post(endpoints.bookings.create, bookingData),
  getUserBookings: () => api.get(endpoints.bookings.getByUser),
  cancelBooking: (id) => api.put(endpoints.bookings.cancel(id)),
  rescheduleBooking: (id, data) => api.put(endpoints.bookings.reschedule(id), data),
  checkSlotAvailability: (data) => api.post(endpoints.bookings.checkAvailability, data),
  getAvailableSlots: (bunkId, date) => api.get(endpoints.bookings.getAvailableSlots(bunkId, date)),

  // Admin User Management
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
  adminUpdateUserStatus: (userId, status) => api.put(endpoints.admin.updateUserStatus(userId), { status }),
  adminDeleteUser: (userId) => api.delete(endpoints.admin.deleteUser(userId)),

  // Admin EV Bunks Management
  adminGetAllBunks: () => api.get(endpoints.admin.getAllBunks),
  adminGetBunkById: (id) => api.get(endpoints.admin.getBunkById(id)),
  adminCreateBunk: (bunkData) => api.post(endpoints.admin.createBunk, bunkData),
  adminUpdateBunk: (id, bunkData) => api.put(endpoints.admin.updateBunk(id), bunkData),
  adminDeleteBunk: (id) => api.delete(endpoints.admin.deleteBunk(id)),

  // Admin Booking Management - CORRECTED TO MATCH BACKEND ROUTES
  adminGetAllBookings: (filters = {}) => {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.search) params.search = filters.search;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    
    // This uses the admin-protected /api/bookings route
    return api.get(endpoints.bookings.getAll, { params });
  },
  
  // Get specific booking by ID (admin access)
  adminGetBookingById: (id) => api.get(endpoints.bookings.getById(id)),
  
  // Update booking status (admin only) - CORRECTED TO USE PATCH
  adminUpdateBookingStatus: (id, status) => api.patch(endpoints.bookings.updateStatus(id), { status }),
  
  // Get booking statistics (admin only)
  adminGetBookingStats: () => api.get(endpoints.bookings.getStats),

  // Admin Auth Methods
  adminLogin: (credentials) => {
    return api.post(endpoints.admin.adminLogin, credentials).then(response => {
      // Store admin token
      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        // Also store as regular token for backward compatibility
        localStorage.setItem('token', response.data.token);
      }
      return response;
    });
  },
  
  adminRegister: (data) => api.post(endpoints.admin.adminRegister, data),
  adminGetProfile: () => api.get(endpoints.admin.adminProfile),
  adminUpdateProfile: (data) => api.put(endpoints.admin.adminProfile, data),

  // Dashboard & Analytics
  adminGetDashboardStats: () => api.get(endpoints.admin.getDashboardStats),
  adminGetBookingAnalytics: (period = '30') => api.get(endpoints.admin.getBookingAnalytics, { params: { period } }),
};

export default api;