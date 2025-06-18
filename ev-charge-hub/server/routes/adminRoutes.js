// routes/adminRoutes.js - Enhanced with better error handling
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

// Enhanced error handling middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Request logging middleware for debugging
const requestLogger = (req, res, next) => {
  console.log(`🔄 Admin API: ${req.method} ${req.originalUrl}`, {
    body: req.body,
    params: req.params,
    query: req.query,
    headers: {
      authorization: req.headers.authorization ? 'Bearer [TOKEN]' : 'None',
      'content-type': req.headers['content-type']
    }
  });
  next();
};

// Apply request logging to all admin routes
router.use(requestLogger);

// Admin Authentication Routes (No protection needed)
router.post('/register', asyncHandler(registerAdmin));
router.post('/login', asyncHandler(loginAdmin));

// Protected Admin Routes - Apply middleware to all routes below
router.use(protectAdmin);

// Admin Profile Management
router.route('/profile')
  .get(asyncHandler(getAdminProfile))
  .put(asyncHandler(updateAdminProfile));

// User Management Routes
// IMPORTANT: Keep search route BEFORE the /:userId route to avoid conflicts
router.get('/users/search', asyncHandler(searchUsers)); // GET /api/admin/users/search?q=searchTerm
router.get('/users', asyncHandler(getAllUsers)); // GET /api/admin/users?status=active&sortBy=createdAt&sortOrder=desc&q=searchTerm
router.get('/users/:userId', asyncHandler(getUserById)); // GET /api/admin/users/:userId
router.get('/users/:userId/bookings', asyncHandler(getUserBookings)); // GET /api/admin/users/:userId/bookings

// ENHANCED: User status update with comprehensive logging
router.put('/users/:userId/status', asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { status } = req.body;
  
  console.log('🔄 Update User Status Request:', {
    userId,
    status,
    body: req.body,
    contentType: req.headers['content-type']
  });
  
  // Validation
  if (!userId) {
    console.error('❌ Missing userId parameter');
    return res.status(400).json({ 
      message: 'User ID is required',
      error: 'MISSING_USER_ID'
    });
  }
  
  if (!status) {
    console.error('❌ Missing status in request body');
    return res.status(400).json({ 
      message: 'Status is required in request body',
      error: 'MISSING_STATUS'
    });
  }
  
  const validStatuses = ['active', 'inactive', 'suspended', 'banned'];
  if (!validStatuses.includes(status.toLowerCase())) {
    console.error('❌ Invalid status value:', status);
    return res.status(400).json({ 
      message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      error: 'INVALID_STATUS'
    });
  }
  
  try {
    const result = await updateUserStatus(req, res);
    console.log('✅ User status updated successfully:', { userId, status });
    return result;
  } catch (error) {
    console.error('❌ Error updating user status:', error);
    throw error;
  }
}));

// ENHANCED: User deletion with comprehensive logging
router.delete('/users/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  console.log('🔄 Delete User Request:', {
    userId,
    params: req.params
  });
  
  // Validation
  if (!userId) {
    console.error('❌ Missing userId parameter');
    return res.status(400).json({ 
      message: 'User ID is required',
      error: 'MISSING_USER_ID'
    });
  }
  
  try {
    const result = await deleteUser(req, res);
    console.log('✅ User deleted successfully:', { userId });
    return result;
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    throw error;
  }
}));

// Dashboard & Analytics Routes
router.get('/stats', asyncHandler(getDashboardStats)); // GET /api/admin/stats
router.get('/bookings/analytics', asyncHandler(getBookingAnalytics)); // GET /api/admin/bookings/analytics?period=30

// Additional utility routes (optional)
router.get('/users/:userId/stats', asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  try {
    // Get user statistics - implement in controller if needed
    res.json({ 
      message: 'User stats endpoint - implement in controller',
      userId 
    });
  } catch (error) {
    console.error('❌ Error getting user stats:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message 
    });
  }
}));

// Enhanced error handling middleware
router.use((error, req, res, next) => {
  console.error('❌ Admin Route Error:', {
    error: error.message,
    stack: error.stack,
    request: {
      method: req.method,
      url: req.originalUrl,
      body: req.body,
      params: req.params
    }
  });
  
  // Don't expose internal errors in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(error.status || 500).json({
    message: error.message || 'Internal server error',
    ...(isDevelopment && { stack: error.stack }),
    error: error.name || 'SERVER_ERROR'
  });
});

export default router;