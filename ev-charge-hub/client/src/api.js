// client/src/api.js
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
    // Admin routes typically start with '/api/admin'
    // User-specific routes or general routes might use 'userToken'
    if (config.url.startsWith('/api/admin')) {
      token = localStorage.getItem('token'); // Use 'token' for admin routes
    } else {
      token = localStorage.getItem('userToken'); // Use 'userToken' for other routes (e.g., user-specific, general bunks)
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log requests only in development environment
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      if (token) {
        console.log(`   Token Used: ${token.substring(0, 20)}...`); // Log a snippet of the token
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
    // Log responses only in development environment
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
      console.log('Response data:', response.data);
    }
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error);

    if (error.response) {
      const { status, data, config } = error.response; // Destructure config to get original URL
      console.error(`HTTP Error ${status}:`, data);

      switch (status) {
        case 401: // Unauthorized: Token expired or invalid
          console.warn('Unauthorized: Token expired or invalid. Attempting redirection.');
          // Redirect based on the original request's path
          if (config.url.startsWith('/api/admin')) {
            localStorage.removeItem('token'); // Clear admin token
            window.location.href = '/admin/login'; // Redirect to admin login
          } else {
            localStorage.removeItem('userToken'); // Clear user token
            localStorage.removeItem('user'); // Also clear user object if stored
            window.location.href = '/user/login'; // Redirect to user login
          }
          break;
        case 403: // Forbidden: User lacks necessary permissions
          console.error('Access forbidden: You do not have permission to perform this action.');
          // Optionally, redirect to a generic error page or show a specific message
          break;
        case 404: // Not Found: API endpoint does not exist
          console.error('API endpoint not found:', error.config.url);
          break;
        case 500: // Internal Server Error: General server-side error
          console.error('Internal server error. Please try again later.');
          break;
        default: // Handle other HTTP error codes
          console.error('Unexpected error status:', status);
      }

      const errorMessage = data?.message || data?.error || `HTTP Error ${status}. Please try again.`;
      return Promise.reject(new Error(errorMessage));

    } else if (error.request) {
      // The request was made but no response was received (e.g., network error)
      console.error('No response received from server:', error.request);
      return Promise.reject(new Error('Cannot connect to server. Please check your internet connection or try again later.'));

    } else {
      // Something happened in setting up the request that triggered an Error
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
    // create, update, delete for bunks are handled under admin routes below
    getAvailable: '/api/bunks/available',
    getNearby: '/api/bunks/nearby',
    search: '/api/bunks/search',
    getByConnector: (connectorType) => `/api/bunks/connector/${connectorType}`, // Changed to template literal for consistency
  },

  // Auth endpoints (for regular users)
  auth: {
    login: '/api/users/login',
    register: '/api/users/register',
    profile: '/api/users/profile',
  },

  // Booking endpoints (User & Admin)
  bookings: {
    // User booking endpoints (under /api/bookings)
    create: '/api/bookings/create',
    getByUser: '/api/bookings/user',
    cancel: (id) => `/api/bookings/cancel/${id}`,
    reschedule: (id) => `/api/bookings/reschedule/${id}`,
    checkAvailability: '/api/bookings/check-availability',
    getAvailableSlots: (bunkId, date) => `/api/bookings/available-slots/${bunkId}/${date}`,
    
    // Admin booking endpoints (these are under /api/bookings as mounted in server.js)
    // Note: To use the admin token, it's best if these endpoints also start with /api/admin on the backend.
    getAll: '/api/bookings', // Original general booking endpoint
    getById: (id) => `/api/bookings/${id}`, // Original general booking endpoint
    updateStatus: (id) => `/api/bookings/${id}/status`, // Original general booking endpoint
    getStats: '/api/bookings/stats', // Original general booking endpoint
  },

  // Admin specific endpoints (routes starting with /api/admin)
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
    searchUsers: (query) => `/api/admin/users/search?q=${query}`, // Changed to template literal
    getUserById: (id) => `/api/admin/users/${id}`,
    getUserBookings: (id) => `/api/admin/users/${id}/bookings`, // Changed to template literal
    updateUserStatus: (id) => `/api/admin/users/${id}/status`, // Changed to template literal
    deleteUser: (id) => `/api/admin/users/${id}`, // Changed to template literal
    
    // Dashboard & Analytics
    getDashboardStats: '/api/admin/stats',
    getBookingAnalytics: (period) => `/api/admin/bookings/analytics?period=${period}`, // Changed to template literal

    // New: Admin-specific endpoint for fetching ALL bookings
    getAllAdminBookings: '/api/admin/bookings', // This is the new endpoint for AdminBookingsList
  }
};

// Convenience methods for common API operations, abstracting Axios calls
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
    api.get(endpoints.bunks.getByConnector(connectorType)), // Corrected to call the function

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

  // Admin User Management Operations
  adminGetAllUsers: (statusFilter = 'all', sortBy = 'createdAt', sortOrder = 'desc', searchTerm = '') => {
    const params = {};
    if (statusFilter !== 'all') params.status = statusFilter;
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    if (searchTerm) params.q = searchTerm;
    
    return api.get(endpoints.admin.getAllUsers, { params });
  },
  adminSearchUsers: (query) => api.get(endpoints.admin.searchUsers(query)), // Corrected to call the function
  adminGetUserById: (id) => api.get(endpoints.admin.getUserById(id)),
  adminGetUserBookings: (userId) => api.get(endpoints.admin.getUserBookings(userId)),
  adminUpdateUserStatus: (userId, status) => api.put(endpoints.admin.updateUserStatus(userId), { status }),
  adminDeleteUser: (userId) => api.delete(endpoints.admin.deleteUser(userId)),

  // Admin Booking Management Operations - NOW USING THE NEW ADMIN-SPECIFIC ENDPOINT
  adminGetAllBookings: (filters = {}) => {
    const params = {};
    if (filters.status) params.status = filters.status;
    if (filters.startDate) params.startDate = filters.startDate; // Corrected: assign to params, not filters
    if (filters.endDate) params.endDate = filters.endDate;       // Corrected: assign to params, not filters
    if (filters.search) params.search = filters.search;
    if (filters.page) params.page = filters.page;
    if (filters.limit) params.limit = filters.limit;
    
    // Use the newly defined admin-specific endpoint for fetching all bookings
    return api.get(endpoints.admin.getAllAdminBookings, { params }); 
  },
  
  adminGetBookingById: (id) => api.get(endpoints.bookings.getById(id)), // Could become admin-specific
  adminUpdateBookingStatus: (id, status) => api.patch(endpoints.bookings.updateStatus(id), { status }), // Could become admin-specific
  adminGetBookingStats: () => api.get(endpoints.bookings.getStats), // Could become admin-specific

  // Admin Authentication Operations
  adminLogin: (credentials) => api.post(endpoints.admin.adminLogin, credentials),
  adminRegister: (data) => api.post(endpoints.admin.adminRegister, data),
  adminGetProfile: () => api.get(endpoints.admin.adminProfile),
  adminUpdateProfile: (data) => api.put(endpoints.admin.adminProfile, data),

  // Admin Bunk Operations (admin exclusive)
  adminAddBunk: (bunkData) => api.post(endpoints.admin.addBunk, bunkData),
  adminGetBunks: () => api.get(endpoints.admin.getAdminBunks),
  adminUpdateBunk: (id, bunkData) => api.put(endpoints.admin.updateBunk(id), bunkData),
  adminDeleteBunk: (id) => api.delete(endpoints.admin.deleteBunk(id)),

  // Admin Dashboard & Analytics Operations
  adminGetDashboardStats: () => api.get(endpoints.admin.getDashboardStats),
  adminGetBookingAnalytics: (period = '30') => api.get(endpoints.admin.getBookingAnalytics(period), { params: { period } }), // Corrected to call the function
};

export default api;
