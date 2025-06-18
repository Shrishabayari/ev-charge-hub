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
import { protectAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin Authentication Routes (No protection needed)
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Protected Admin Routes - Apply middleware to all routes below
router.use(protectAdmin);

// Admin Profile Management
router.route('/profile')
  .get(getAdminProfile)
  .put(updateAdminProfile);

// User Management Routes
// IMPORTANT: Keep search route BEFORE the /:userId route to avoid conflicts
router.get('/users/search', searchUsers); // GET /api/admin/users/search?q=searchTerm
router.get('/users', getAllUsers); // GET /api/admin/users?status=active&sortBy=createdAt&sortOrder=desc&q=searchTerm
router.get('/users/:userId', getUserById); // GET /api/admin/users/:userId
router.get('/users/:userId/bookings', getUserBookings); // GET /api/admin/users/:userId/bookings
router.put('/users/:userId/status', updateUserStatus); // PUT /api/admin/users/:userId/status
router.delete('/users/:userId', deleteUser); // DELETE /api/admin/users/:userId

// Dashboard & Analytics Routes
router.get('/stats', getDashboardStats); // GET /api/admin/stats
router.get('/bookings/analytics', getBookingAnalytics); // GET /api/admin/bookings/analytics?period=30

// Additional utility routes (optional)
router.get('/users/:userId/stats', async (req, res) => {
  try {
    const { userId } = req.params;
    // Get user statistics - implement in controller if needed
    res.json({ message: 'User stats endpoint - implement in controller' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;