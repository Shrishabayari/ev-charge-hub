// routes/bookingRoutes.js
import express from 'express';
import authMiddleware from '../middleware/auth.js';
import { protectAdmin } from '../middleware/protectAdmin.js'; // Import protectAdmin

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

// Protected routes (User-level authentication)
router.post('/create', authMiddleware, createBooking);
router.get('/user', authMiddleware, getUserBookings);
router.put('/cancel/:id', authMiddleware, cancelBooking);
router.put('/reschedule/:id', authMiddleware, rescheduleBooking);

// Admin routes (Require admin authentication - using protectAdmin)
// These routes should be accessed only by authenticated admins
router.get('/stats', protectAdmin, getBookingStats);
router.get('/:id', protectAdmin, getBookingDetails); // To get details for *any* booking by ID (admin view)
router.patch('/:id/status', protectAdmin, updateBookingStatus); // Admin-only status update

// This should be last to avoid conflicts with specific routes above
router.get('/', protectAdmin, getAllBookings); // Admin-only view of all bookings

export default router;