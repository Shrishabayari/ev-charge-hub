// routes/adminRoutes.js
import express from 'express';
import {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  getAllUsers,
  getUserBookings,
  getUserById,
  getDashboardStats, // This is for overall dashboard stats
  updateUserStatus,
  deleteUser,
  searchUsers,
  getBookingAnalytics // This is for general booking analytics
} from '../controllers/adminController.js';

// No need to import bookingController functions here, as they will be used via bookingRoutes.js
// import { getAllBookings, getBookingStats, updateBookingStatus, getBookingDetails } from '../controllers/bookingController.js';

import { protectAdmin } from '../middleware/protectAdmin.js';

const router = express.Router();

// Public routes for Admin (no authentication needed for login/register)
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Admin Profile Routes (Protected)
router.route('/profile')
  .get(protectAdmin, getAdminProfile)
  .put(protectAdmin, updateAdminProfile);

// User Management Routes (Protected)
router.get('/users', protectAdmin, getAllUsers);
router.get('/users/search', protectAdmin, searchUsers);
router.get('/users/:userId', protectAdmin, getUserById);
router.get('/users/:userId/bookings', protectAdmin, getUserBookings); // Admin getting a specific user's bookings
router.put('/users/:userId/status', protectAdmin, updateUserStatus);
router.delete('/users/:userId', protectAdmin, deleteUser);

// Dashboard & Analytics Routes (Protected) - These use functions from adminController
router.get('/stats', protectAdmin, getDashboardStats); // Overall system stats
router.get('/analytics/bookings', protectAdmin, getBookingAnalytics); // Booking trends/popular stations

// REMOVED DUPLICATE ADMIN BOOKING ROUTES:
// These routes are already defined and handled in routes/bookingRoutes.js
// router.get('/bookings', protectAdmin, getAllBookings);
// router.get('/bookings/stats', protectAdmin, getBookingStats);
// router.get('/bookings/:id', protectAdmin, getBookingDetails);
// router.patch('/bookings/:id/status', protectAdmin, updateBookingStatus);


export default router;
