import express from 'express';
import authMiddleware from '../middleware/auth.js';
import {
  getBookingsByBunk,
  createBooking,
  getUserBookings,
  cancelBooking,
  rescheduleBooking,
  checkSlotAvailability,
  getAvailableSlots,
  getAllBookings,
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

// Admin routes - moved to correct order and paths
router.get('/stats', authMiddleware, getBookingStats);
router.get('/:id', authMiddleware, getBookingDetails);
router.patch('/:id/status', authMiddleware, updateBookingStatus);

// This should be last to avoid conflicts with specific routes above
router.get('/', authMiddleware, getAllBookings);

export default router;