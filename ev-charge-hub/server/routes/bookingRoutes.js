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
  getAllBookings, // Used for /admin/all
  getBookingStats, // Used for /admin/stats
  updateBookingStatus, // Used for /admin/:id/status
  getBookingDetails // Used for /admin/:id
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

// **ADMIN ROUTES - MUST BE DEFINED BEFORE GENERAL ROUTES**
// Admin-specific booking routes with /admin prefix
router.get('/admin/all', protectAdmin, getAllBookings);           // GET /api/bookings/admin/all
router.get('/admin/stats', protectAdmin, getBookingStats);        // GET /api/bookings/admin/stats
router.get('/admin/:id', protectAdmin, getBookingDetails);        // GET /api/bookings/admin/:id
router.patch('/admin/:id/status', protectAdmin, updateBookingStatus); // PATCH /api/bookings/admin/:id/status

// General booking route (fallback for authenticated users)
router.get('/', authMiddleware, getUserBookings);

export default router;
