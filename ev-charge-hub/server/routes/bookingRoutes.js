// routes/bookingRoutes.js
import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { protectAdmin } from '../middleware/protectAdmin.js';
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
router.get('/api/bookings/bunk/:bunkId', getBookingsByBunk);
router.post('/api/bookings/check-availability', checkSlotAvailability);
router.get('/api/bookings/available-slots/:bunkId/:date', getAvailableSlots);

// Protected routes (User-level authentication)
router.post('/api/bookings/create', authMiddleware, createBooking);
router.get('/api/bookings/user', authMiddleware, getUserBookings);
router.put('/api/bookings/cancel/:id', authMiddleware, cancelBooking);
router.put('/api/bookings/reschedule/:id', authMiddleware, rescheduleBooking);

// Admin routes (Require admin authentication)
router.get('/api/bookings/stats', protectAdmin, getBookingStats);
router.get('/api/bookings/:id', protectAdmin, getBookingDetails);
router.patch('/api/bookings/:id/status', protectAdmin, updateBookingStatus);

// This should be last to avoid conflicts with specific routes above
router.get('/api/bookings/', protectAdmin, getAllBookings);

export default router;