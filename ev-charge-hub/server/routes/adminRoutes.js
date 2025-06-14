
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
  getDashboardStats,
  updateUserStatus,
  deleteUser,
  searchUsers,
  getBookingAnalytics
} from '../controllers/adminController.js';

import { protectAdmin } from '../middleware/protectAdmin.js';

const router = express.Router();

// Public routes for Admin
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
router.get('/users/:userId/bookings', protectAdmin, getUserBookings);
router.put('/users/:userId/status', protectAdmin, updateUserStatus);
router.delete('/users/:userId', protectAdmin, deleteUser);

// Dashboard & Analytics Routes (Protected)
router.get('/stats', protectAdmin, getDashboardStats);
router.get('/analytics/bookings', protectAdmin, getBookingAnalytics);

export default router;

