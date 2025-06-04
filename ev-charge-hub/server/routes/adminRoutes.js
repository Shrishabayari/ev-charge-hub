// routes/adminRoutes.js
import express from 'express';
import { 
  registerAdmin, 
  loginAdmin, 
  getAdminProfile,    // Import new function
  updateAdminProfile, // Import new function
  getAllUsers,
  getUserBookings,
  getUserById,
  getDashboardStats,
  updateUserStatus,
  deleteUser,
  searchUsers,
  getBookingAnalytics 
} from '../controllers/adminController.js';

import { protectAdmin } from '../middleware/protectAdmin.js'; // Correct import path for admin middleware

const router = express.Router();

// Public routes for Admin (no authentication needed)
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Admin Profile Routes (Protected)
// These routes will now use the specific protectAdmin middleware
router.route('/profile')
  .get(protectAdmin, getAdminProfile)    // GET admin profile
  .put(protectAdmin, updateAdminProfile); // PUT update admin profile

// User Management Routes (Protected)
router.get('/users', protectAdmin, getAllUsers);           // Get all users with booking counts
router.get('/users/search', protectAdmin, searchUsers);    // Search users
router.get('/users/:userId', protectAdmin, getUserById);   // Get specific user details
router.get('/users/:userId/bookings', protectAdmin, getUserBookings); // Get user's booking history
router.put('/users/:userId/status', protectAdmin, updateUserStatus); // Update user status
router.delete('/users/:userId', protectAdmin, deleteUser); // Delete user (soft delete)

// Dashboard & Analytics Routes (Protected)
router.get('/stats', protectAdmin, getDashboardStats);           // Get dashboard statistics
router.get('/bookings/analytics', protectAdmin, getBookingAnalytics); // Get booking analytics

export default router;