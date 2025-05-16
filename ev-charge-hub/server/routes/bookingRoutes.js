import express from 'express'; 
import authMiddleware from '../middleware/auth.js'; 
import {
  getBookingsByBunk,
  createBooking,
  getUserBookings,
  cancelBooking,
  rescheduleBooking,
  checkSlotAvailability,
  getAvailableSlots , getAllBookings, 
  getBookingStats, 
  updateBookingStatus, 
  getBookingDetails 
} from '../controllers/bookingController.js';

const router = express.Router();

// Public routes 
router.get('/bunk/:bunkId', getBookingsByBunk);
router.post('/check-availability', checkSlotAvailability);
router.get('/available-slots/:bunkId/:date', getAvailableSlots);

// Protected routes - require authentication
router.post('/create', authMiddleware, createBooking);
router.get('/user', authMiddleware, getUserBookings);
router.put('/cancel/:id', authMiddleware, cancelBooking);
router.put('/reschedule/:id', authMiddleware, rescheduleBooking);
router.get('/', authMiddleware, getAllBookings);

// Get booking statistics for admin dashboard
router.get('/bookings/stats', authMiddleware, getBookingStats);

// Get details of a specific booking
router.get('/bookings/:id', authMiddleware, getBookingDetails);

// Update booking status (active, cancelled, completed)
router.patch('/bookings/:id/status', authMiddleware, updateBookingStatus);
export default router;