// src/services/bookingService.js
import axios from 'axios';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Create auth header
const authHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Get all bookings (admin only)
export const getAllBookings = async () => {
  try {
    const response = await axios.get('/api/admin/bookings', {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get bookings for a specific bunk
export const getBookingsByBunk = async (bunkId) => {
  try {
    const response = await axios.get(`/api/bookings/bunk/${bunkId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get current user's bookings
export const getUserBookings = async () => {
  try {
    const response = await axios.get('/api/bookings/user', {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new booking
export const createBooking = async (bookingData) => {
  try {
    const response = await axios.post('/api/bookings/create', bookingData, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Cancel a booking
export const cancelBooking = async (bookingId) => {
  try {
    const response = await axios.put(`/api/bookings/cancel/${bookingId}`, {}, {
      headers: authHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Reschedule a booking
export const rescheduleBooking = async (bookingId, newSlotTime) => {
  try {
    const response = await axios.put(`/api/bookings/reschedule/${bookingId}`, 
      { newSlotTime }, 
      { headers: authHeader() }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Check slot availability
export const checkSlotAvailability = async (bunkId, slotTime) => {
  try {
    const response = await axios.post('/api/bookings/check-availability', {
      bunkId,
      slotTime
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get available slots for a specific date and bunk
export const getAvailableSlots = async (bunkId, date) => {
  try {
    const response = await axios.get(`/api/bookings/available-slots/${bunkId}/${date}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};