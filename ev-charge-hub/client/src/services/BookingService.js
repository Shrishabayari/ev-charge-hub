/**
 * BookingService.js
 * Service module for handling all Booking API interactions
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
 * BookingService - for managing bookings
 */
export const bookingService = {
  // Get all bookings
  getAllBookings: async () => {
    try {
      const response = await apiClient.get('/bookings');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get bookings for a specific bunk
  getBookingsByBunk: async (bunkId) => {
    try {
      const response = await apiClient.get(`/bookings/bunk/${bunkId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get bookings for a specific user
  getBookingsByUser: async (userId) => {
    try {
      const response = await apiClient.get(`/bookings/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get a single booking by ID
  getBookingById: async (bookingId) => {
    try {
      const response = await apiClient.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a new booking
  createBooking: async (bookingData) => {
    try {
      const response = await apiClient.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update an existing booking
  updateBooking: async (bookingId, bookingData) => {
    try {
      const response = await apiClient.put(`/bookings/${bookingId}`, bookingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Cancel a booking
  cancelBooking: async (bookingId) => {
    try {
      const response = await apiClient.patch(`/bookings/${bookingId}/cancel`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Reschedule a booking
  rescheduleBooking: async (bookingId, newSlotTime) => {
    try {
      const response = await apiClient.patch(`/bookings/${bookingId}/reschedule`, { slotTime: newSlotTime });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get bookings statistics
  getBookingStats: async () => {
    try {
      const response = await apiClient.get('/bookings/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Filter bookings by date range
  getBookingsByDateRange: async (startDate, endDate) => {
    try {
      const response = await apiClient.get('/bookings/daterange', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Filter bookings by status
  getBookingsByStatus: async (status) => {
    try {
      const response = await apiClient.get('/bookings/status', {
        params: { status }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Export individual methods directly
export const { 
  getAllBookings, 
  getBookingsByBunk, 
  getBookingsByUser, 
  getBookingById, 
  createBooking, 
  updateBooking,
  cancelBooking,
  rescheduleBooking,
  getBookingStats,
  getBookingsByDateRange,
  getBookingsByStatus
} = bookingService;

// Export default as named object
export default bookingService;