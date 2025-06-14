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

// Admin-accessible routes for general booking management
// These routes allow admins to access all bookings through /api/bookings/admin/*
router.get('/admin/all', protectAdmin, getAllBookings);         // GET /api/bookings/admin/all
router.get('/admin/stats', protectAdmin, getBookingStats);      // GET /api/bookings/admin/stats
router.get('/admin/:id', protectAdmin, getBookingDetails);      // GET /api/bookings/admin/:id
router.patch('/admin/:id/status', protectAdmin, updateBookingStatus); // PATCH /api/bookings/admin/:id/status

// Main route for getting all bookings - accessible by both users and admins
// This handles requests to /api/bookings
router.get('/', async (req, res, next) => {
  // Try to authenticate as admin first. If admin, use getAllBookings (all bookings).
  // If not admin, try user auth. If user, use getUserBookings (their bookings).
  try {
    const adminAuth = await import('../middleware/protectAdmin.js');
    return adminAuth.protectAdmin(req, res, () => {
      // If protectAdmin succeeds, this is an admin request. Let it proceed to getAllBookings.
      req.isAdmin = true; // Mark as admin to help getAllBookings if it needs to differentiate
      return getAllBookings(req, res, next);
    });
  } catch (adminError) {
    // If admin auth fails, try user auth
    try {
      return authMiddleware(req, res, () => {
        // If authMiddleware succeeds, this is a regular user. Show their bookings.
        return getUserBookings(req, res, next);
      });
    } catch (userError) {
      // If neither admin nor user auth works
      return res.status(401).json({ message: 'Authentication required to access booking data' });
    }
  }
});

export default router;
