// client/src/api.js (Updated with proper booking endpoints and fallbacks)
import axios from 'axios';

// Prioritize environment variable, then remote server, then local development server
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://ev-charge-hub-server1.onrender.com' || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increased timeout for potentially slower network conditions
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token if available
api.interceptors.request.use(
  (config) => {
    let token = null;

    // Determine which token to use based on the URL
    if (config.url.startsWith('/api/admin')) {
      token = localStorage.getItem('token'); // Use 'token' for admin routes
    } else {
      token = localStorage.getItem('userToken'); // Use 'userToken' for other routes
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log requests only in development environment
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      if (token) {
        console.log(`   Token Used: ${token.substring(0, 20)}...`);
      } else {
        console.log('   No token sent for this request.');
      }
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
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
      console.log('Response data:', response.data);
    }
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error);

    if (error.response) {
      const { status, data, config } = error.response;
      console.error(`HTTP Error ${status}:`, data);

      switch (status) {
        case 401: // Unauthorized
          console.warn('Unauthorized: Token expired or invalid. Attempting redirection.');
          if (config.url.startsWith('/api/admin')) {
            localStorage.removeItem('token');
            window.location.href = '/admin/login';
          } else {
            localStorage.removeItem('userToken');
            localStorage.removeItem('user');
            window.location.href = '/user/login';
          }
          break;
        case 403: // Forbidden
          console.error('Access forbidden: You do not have permission to perform this action.');
          break;
        case 404: // Not Found
          console.error('API endpoint not found:', error.config.url);
          break;
        case 500: // Internal Server Error
          console.error('Internal server error. Please try again later.');
          break;
        default:
          console.error('Unexpected error status:', status);
      }

      const errorMessage = data?.message || data?.error || `HTTP Error ${status}. Please try again.`;
      return Promise.reject(new Error(errorMessage));

    } else if (error.request) {
      console.error('No response received from server:', error.request);
      return Promise.reject(new Error('Cannot connect to server. Please check your internet connection or try again later.'));
    } else {
      console.error('Request setup error:', error.message);
      return Promise.reject(new Error(`Request configuration error: ${error.message}`));
    }
  }
);

// API endpoints object for better organization
export const endpoints = {
  // EV Bunks endpoints (general access or user access)
  bunks: {
    getAll: '/api/bunks',
    getById: (id) => `/api/bunks/${id}`,
    getAvailable: '/api/bunks/available',
    getNearby: '/api/bunks/nearby',
    search: '/api/bunks/search',
    getByConnector: (connectorType) => `/api/bunks/connector/${connectorType}`,
  },

  // Auth endpoints (for regular users)
  auth: {
    login: '/api/users/login',
    register: '/api/users/register',
    profile: '/api/users/profile',
  },

  // Booking endpoints (User routes)
  bookings: {
    create: '/api/bookings/create',
    getByUser: '/api/bookings/user',
    cancel: (id) => `/api/bookings/cancel/${id}`,
    reschedule: (id) => `/api/bookings/reschedule/${id}`,
    checkAvailability: '/api/bookings/check-availability',
    getAvailableSlots: (bunkId, date) => `/api/bookings/available-slots/${bunkId}/${date}`,
    updateStatus: (id) => `/api/bookings/${id}/status`, // Alternative endpoint
  },

  // Admin specific endpoints
  admin: {
    // Admin Auth
    adminLogin: '/api/admin/login',
    adminRegister: '/api/admin/register',
    adminProfile: '/api/admin/profile',

    // Admin Bunk Management
    addBunk: '/api/admin/ev-bunks',
    getAdminBunks: '/api/admin/ev-bunks',
    updateBunk: (id) => `/api/admin/ev-bunks/${id}`,
    deleteBunk: (id) => `/api/admin/ev-bunks/${id}`,

    // User Management (admin perspective)
    getAllUsers: '/api/admin/users',
    searchUsers: (query) => `/api/admin/users/search?q=${query}`,
    getUserById: (id) => `/api/admin/users/${id}`,
    getUserBookings: (id) => `/api/admin/users/${id}/bookings`,
    updateUserStatus: (id) => `/api/admin/users/${id}/status`,
    deleteUser: (id) => `/api/admin/users/${id}`,
    
    // Dashboard & Analytics
    getDashboardStats: '/api/admin/stats',
    getBookingAnalytics: (period) => `/api/admin/bookings/analytics?period=${period}`,

    // Admin Booking Management - Multiple possible endpoints
    bookings: {
      getAll: '/api/admin/bookings',
      getById: (id) => `/api/admin/bookings/${id}`,
      update: (id) => `/api/admin/bookings/${id}`, // Full booking update
      updateStatus: (id) => `/api/admin/bookings/${id}/status`, // Status-specific endpoint
      getStats: '/api/admin/bookings/stats',
    }
  }
};

// Convenience methods for common API operations
export const apiMethods = {
  // Bunk Operations (user/general access)
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
    api.get(endpoints.bunks.getByConnector(connectorType)),

  // User Auth Operations
  userLogin: (credentials) => api.post(endpoints.auth.login, credentials),
  userRegister: (data) => api.post(endpoints.auth.register, data),
  userGetProfile: () => api.get(endpoints.auth.profile),
  userUpdateProfile: (data) => api.put(endpoints.auth.profile, data),

  // User Booking Operations
  createBooking: (bookingData) => api.post(endpoints.bookings.create, bookingData),
  getUserBookings: () => api.get(endpoints.bookings.getByUser),
  cancelBooking: (id) => api.put(endpoints.bookings.cancel(id)),
  rescheduleBooking: (id, data) => api.put(endpoints.bookings.reschedule(id), data),
  checkSlotAvailability: (data) => api.post(endpoints.bookings.checkAvailability, data),
  getAvailableSlots: (bunkId, date) => api.get(endpoints.bookings.getAvailableSlots(bunkId, date)),

  // Admin Authentication Operations
  adminLogin: (credentials) => api.post(endpoints.admin.adminLogin, credentials),
  adminRegister: (data) => api.post(endpoints.admin.adminRegister, data),
  adminGetProfile: () => api.get(endpoints.admin.adminProfile),
  adminUpdateProfile: (data) => api.put(endpoints.admin.adminProfile, data),

  // Admin Bunk Operations
  adminAddBunk: (bunkData) => api.post(endpoints.admin.addBunk, bunkData),
  adminGetBunks: () => api.get(endpoints.admin.getAdminBunks),
  adminUpdateBunk: (id, bunkData) => api.put(endpoints.admin.updateBunk(id), bunkData),
  adminDeleteBunk: (id) => api.delete(endpoints.admin.deleteBunk(id)),

  // Admin User Management Operations
  adminGetAllUsers: (statusFilter = 'all', sortBy = 'createdAt', sortOrder = 'desc', searchTerm = '') => {
    const params = {};
    if (statusFilter !== 'all') params.status = statusFilter;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    if (searchTerm) params.q = searchTerm;
    
    return api.get(endpoints.admin.getAllUsers, { params });
  },
  adminSearchUsers: (query) => api.get(endpoints.admin.searchUsers(query)),
  adminGetUserById: (id) => api.get(endpoints.admin.getUserById(id)),
  adminGetUserBookings: (userId) => api.get(endpoints.admin.getUserBookings(userId)),
  adminUpdateUserStatus: (userId, status) => api.put(endpoints.admin.updateUserStatus(userId), { status }),
  adminDeleteUser: (userId) => api.delete(endpoints.admin.deleteUser(userId)),

  // Admin Booking Management Operations
  adminGetAllBookings: (filters = {}) => {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.search) params.search = filters.search;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    
    return api.get(endpoints.admin.bookings.getAll, { params });
  },
  
  adminGetBookingById: (id) => api.get(endpoints.admin.bookings.getById(id)),
  
  // Updated booking status method with multiple fallback attempts
  adminUpdateBookingStatus: async (id, status) => {
    const endpoints = [
      // Try different possible endpoints in order of likelihood
      { url: `/api/admin/bookings/${id}`, method: 'PATCH', data: { status } },
      { url: `/api/admin/bookings/${id}/status`, method: 'PATCH', data: { status } },
      { url: `/api/admin/bookings/${id}`, method: 'PUT', data: { status } },
      { url: `/api/bookings/${id}/status`, method: 'PATCH', data: { status } },
      { url: `/api/bookings/${id}`, method: 'PATCH', data: { status } },
      { url: `/api/admin/bookings/${id}/status`, method: 'PUT', data: { status } },
    ];

    let lastError = null;

    for (const endpoint of endpoints) {
      try {
        console.log(`🔄 Trying booking status update: ${endpoint.method} ${endpoint.url}`);
        const response = await api.request({
          method: endpoint.method,
          url: endpoint.url,
          data: endpoint.data
        });
        console.log(`✅ Success with: ${endpoint.method} ${endpoint.url}`);
        return response;
      } catch (error) {
        lastError = error;
        console.log(`❌ Failed with: ${endpoint.method} ${endpoint.url} - ${error.response?.status || error.message}`);
        
        // If we get a non-404 error, it might be a different issue, so break
        if (error.response?.status !== 404) {
          break;
        }
      }
    }

    // If all endpoints failed, throw the last error
    throw lastError || new Error('All booking status update endpoints failed');
  },
  
  adminGetBookingStats: (timeframe = 'daily') => 
    api.get(endpoints.admin.bookings.getStats, { params: { timeframe } }),
};

export default api;