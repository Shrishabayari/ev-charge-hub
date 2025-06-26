// routes/adminRoutes.js
import express from 'express';
import {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  getAllUsers,
  getUserById,
  getUserBookings,
  updateUserStatus,
  deleteUser,
  searchUsers,
  getDashboardStats,
  getBookingAnalytics,
  // ✅ Booking controller imports
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  getBookingStats
} from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Auth routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/profile', protectAdmin, getAdminProfile);
router.put('/profile', protectAdmin, updateAdminProfile);

// User management routes
router.get('/users', protectAdmin, getAllUsers);
router.get('/users/search', protectAdmin, searchUsers);
router.get('/users/:userId', protectAdmin, getUserById);
router.get('/users/:userId/bookings', protectAdmin, getUserBookings);
router.put('/users/:userId/status', protectAdmin, updateUserStatus);
router.delete('/users/:userId', protectAdmin, deleteUser);

// Dashboard & Analytics
router.get('/stats', protectAdmin, getDashboardStats);
router.get('/bookings/analytics', protectAdmin, getBookingAnalytics);

// ✅ FIXED: Admin Booking Management Routes
// NOTE: Order matters! More specific routes should come before general ones
router.get('/bookings/stats', protectAdmin, getBookingStats);

// ✅ FIXED: Booking status update routes (using consistent parameter name)
router.patch('/bookings/:id/status', protectAdmin, updateBookingStatus);
router.put('/bookings/:id/status', protectAdmin, updateBookingStatus);
router.patch('/bookings/:id', protectAdmin, updateBookingStatus);
router.put('/bookings/:id', protectAdmin, updateBookingStatus);

// ✅ FIXED: Individual booking routes (must come after status routes)
router.get('/bookings/:id', protectAdmin, getBookingById);

// ✅ FIXED: General bookings route (must come last)
router.get('/bookings', protectAdmin, getAllBookings);

export default router;