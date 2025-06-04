import express from 'express';
import { registerAdmin, loginAdmin, getAllUsers,
  getUserBookings,
  getUserById,
  getDashboardStats,
  updateUserStatus,
  deleteUser,
  searchUsers,
  getBookingAnalytics } from '../controllers/adminController.js';

const router = express.Router();

// Register and Login routes for Admin
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/users', getAllUsers);                    // Get all users with booking counts
router.get('/users/search', searchUsers);            // Search users
router.get('/users/:userId', getUserById);           // Get specific user details
router.get('/users/:userId/bookings', getUserBookings); // Get user's booking history
router.put('/users/:userId/status', updateUserStatus); // Update user status
router.delete('/users/:userId', deleteUser);         // Delete user (soft delete)

// Dashboard & Analytics Routes
router.get('/stats', getDashboardStats);             // Get dashboard statistics
router.get('/bookings/analytics', getBookingAnalytics); // Get booking analytics



export default router;