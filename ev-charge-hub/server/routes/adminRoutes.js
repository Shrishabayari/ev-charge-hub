// routes/adminRoutes.js
import express from 'express';
import {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  getAllUsers,
  searchUsers,
  getUserById,
  getUserBookings,
  updateUserStatus,
  deleteUser,
  getDashboardStats,
  getBookingAnalytics
} from '../controllers/adminController.js';
import { protectAdmin } from '../middleware/authMiddleware.js'; // Make sure you have admin auth middleware

const router = express.Router();

// Admin Authentication Routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Protected Admin Routes - Require admin authentication
router.use(protectAdmin); // Apply admin protection to all routes below

// Admin Profile Management
router.route('/profile')
  .get(getAdminProfile)
  .put(updateAdminProfile);

// User Management Routes - FIXED TO MATCH CONTROLLER FUNCTIONS
router.get('/users', getAllUsers); // GET all users
router.get('/users/search', searchUsers); // GET search users (must come before /:userId routes)
router.get('/users/:userId', getUserById); // GET specific user details
router.get('/users/:userId/bookings', getUserBookings); // GET user's bookings
router.put('/users/:userId/status', updateUserStatus); // PUT update user status
router.delete('/users/:userId', deleteUser); // DELETE user

// Dashboard & Analytics Routes
router.get('/stats', getDashboardStats);
router.get('/bookings/analytics', getBookingAnalytics);

export default router;