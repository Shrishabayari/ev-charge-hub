/**
 * bunkService.js
 * Service module for handling all Bunk API interactions
 */

import axios from 'axios';

// Base configuration for API requests
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.bunkservice.com/v1';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bunk_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error codes
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized - e.g., logout user, redirect to login
          localStorage.removeItem('bunk_auth_token');
          // You might want to trigger an event or call a function here
          console.error('Authentication error, please log in again');
          break;
        case 403:
          console.error('You do not have permission to perform this action');
          break;
        case 404:
          console.error('The requested resource was not found');
          break;
        case 500:
          console.error('Server error, please try again later');
          break;
        default:
          console.error(`Error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
      }
    } else if (error.request) {
      console.error('Network error, please check your connection');
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Authentication Services
 */
export const authService = {
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('bunk_auth_token', response.data.token);
        localStorage.setItem('bunk_user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('bunk_auth_token');
    localStorage.removeItem('bunk_user');
    // Additional logout logic if needed
  },

  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (email) => {
    try {
      const response = await apiClient.post('/auth/reset-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('bunk_user');
    return user ? JSON.parse(user) : null;
  },
};

/**
 * Bunks Service - for managing bunk resources
 */
export const bunksService = {
  // Get all bunks with optional filters
  getAllBunks: async (filters = {}) => {
    try {
      const response = await apiClient.get('/bunks', { params: filters });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get a single bunk by ID
  getBunkById: async (bunkId) => {
    try {
      const response = await apiClient.get(`/bunks/${bunkId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a new bunk
  createBunk: async (bunkData) => {
    try {
      const response = await apiClient.post('/bunks', bunkData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update an existing bunk
  updateBunk: async (bunkId, bunkData) => {
    try {
      const response = await apiClient.put(`/bunks/${bunkId}`, bunkData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a bunk
  deleteBunk: async (bunkId) => {
    try {
      const response = await apiClient.delete(`/bunks/${bunkId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search bunks
  searchBunks: async (query) => {
    try {
      const response = await apiClient.get('/bunks/search', { params: { q: query } });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

/**
 * Reservations Service - for managing bunk reservations
 */
export const reservationsService = {
  // Get all reservations for the current user
  getUserReservations: async () => {
    try {
      const response = await apiClient.get('/reservations/user');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get reservations for a specific bunk
  getBunkReservations: async (bunkId) => {
    try {
      const response = await apiClient.get(`/bunks/${bunkId}/reservations`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a new reservation
  createReservation: async (reservationData) => {
    try {
      const response = await apiClient.post('/reservations', reservationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update an existing reservation
  updateReservation: async (reservationId, reservationData) => {
    try {
      const response = await apiClient.put(`/reservations/${reservationId}`, reservationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cancel a reservation
  cancelReservation: async (reservationId) => {
    try {
      const response = await apiClient.delete(`/reservations/${reservationId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Check availability for a bunk
  checkAvailability: async (bunkId, startDate, endDate) => {
    try {
      const response = await apiClient.get(`/bunks/${bunkId}/availability`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

/**
 * Users Service - for user management
 */
export const usersService = {
  // Get user profile
  getUserProfile: async () => {
    try {
      const response = await apiClient.get('/users/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (profileData) => {
    try {
      const response = await apiClient.put('/users/profile', profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await apiClient.put('/users/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

/**
 * Reviews Service - for managing bunk reviews
 */
export const reviewsService = {
  // Get reviews for a bunk
  getBunkReviews: async (bunkId) => {
    try {
      const response = await apiClient.get(`/bunks/${bunkId}/reviews`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a review
  createReview: async (bunkId, reviewData) => {
    try {
      const response = await apiClient.post(`/bunks/${bunkId}/reviews`, reviewData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update a review
  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await apiClient.put(`/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    try {
      const response = await apiClient.delete(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

/**
 * Payments Service - for handling payments
 */
export const paymentsService = {
  // Process a payment
  processPayment: async (paymentDetails) => {
    try {
      const response = await apiClient.post('/payments/process', paymentDetails);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get payment history
  getPaymentHistory: async () => {
    try {
      const response = await apiClient.get('/payments/history');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get payment details
  getPaymentDetails: async (paymentId) => {
    try {
      const response = await apiClient.get(`/payments/${paymentId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Export individual methods directly for convenience
export const { getAllBunks, getBunkById, createBunk, updateBunk, deleteBunk, searchBunks } = bunksService;
export const { getUserReservations, getBunkReservations, createReservation, updateReservation, cancelReservation, checkAvailability } = reservationsService;
export const { login, logout, register, resetPassword, getCurrentUser } = authService;
export const { getUserProfile, updateUserProfile, changePassword } = usersService;
export const { getBunkReviews, createReview, updateReview, deleteReview } = reviewsService;
export const { processPayment, getPaymentHistory, getPaymentDetails } = paymentsService;

// Create a named object for the default export to avoid ESLint warning
const BunkService = {
  auth: authService,
  bunks: bunksService,
  reservations: reservationsService,
  users: usersService,
  reviews: reviewsService,
  payments: paymentsService,
};

// Export default as a named object
export default BunkService;