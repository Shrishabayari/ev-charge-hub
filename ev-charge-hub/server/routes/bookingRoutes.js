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
router.get('/bunk/:bunkId', getBookingsByBunk);
router.post('/check-availability', checkSlotAvailability);
router.get('/available-slots/:bunkId/:date', getAvailableSlots);

// Protected routes (User-level authentication)
router.post('/create', authMiddleware, createBooking);
router.get('/user', authMiddleware, getUserBookings);
router.put('/cancel/:id', authMiddleware, cancelBooking);
router.put('/reschedule/:id', authMiddleware, rescheduleBooking);

// Admin-accessible routes for general booking management
// These routes allow admins to access all bookings through /api/bookings
router.get('/admin/all', protectAdmin, getAllBookings);          // GET /api/bookings/admin/all
router.get('/admin/stats', protectAdmin, getBookingStats);       // GET /api/bookings/admin/stats
router.get('/admin/:id', protectAdmin, getBookingDetails);       // GET /api/bookings/admin/:id
router.patch('/admin/:id/status', protectAdmin, updateBookingStatus); // PATCH /api/bookings/admin/:id/status

// Main route for getting all bookings - accessible by both users and admins
router.get('/', async (req, res, next) => {
  // First try to authenticate as admin
  try {
    // Check if admin token is present
    const adminAuth = await import('../middleware/protectAdmin.js');
    return adminAuth.protectAdmin(req, res, () => {
      return getAllBookings(req, res, next);
    });
  } catch (adminError) {
    // If admin auth fails, try user auth
    try {
      return authMiddleware(req, res, () => {
        // For regular users, only show their own bookings
        return getUserBookings(req, res, next);
      });
    } catch (userError) {
      return res.status(401).json({ message: 'Authentication required' });
    }
  }
});

export default router;