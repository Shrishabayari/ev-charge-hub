// controllers/adminController.js
import Admin from "../models/Admin.js"; // Import the Admin model
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import EvBunk from '../models/EvBunkSchema.js';
import asyncHandler from 'express-async-handler'; // Ensure this is imported

// Register Admin
export const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    res.status(400);
    throw new Error("Admin already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newAdmin = new Admin({
    name,
    email,
    password: hashedPassword,
  });

  await newAdmin.save();
  res.status(201).json({ message: "Admin registered successfully" });
});

// Admin Login
export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) {
    res.status(400); // Bad Request
    throw new Error("Email not found. Please register or check your email."); // Specific error for email not found
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    res.status(400); // Bad Request
    throw new Error("Incorrect password. Please try again."); // Specific error for incorrect password
  }

  // JWT token generation
  const token = jwt.sign(
    { id: admin._id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: "365d" }
  );

  res.status(200).json({ message: "Login successful", token });

});
// @desc    Get admin profile
// @route   GET /api/admin/profile
// @access  Private/Admin
export const getAdminProfile = asyncHandler(async (req, res) => {
  // req.admin is populated by the protectAdmin middleware
  const admin = await Admin.findById(req.admin.id).select('-password');

  if (admin) {
    res.status(200).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      createdAt: admin.createdAt,
    });
  } else {
    res.status(404);
    throw new Error('Admin not found');
  }
});

// @desc    Update admin profile
// @route   PUT /api/admin/profile
// @access  Private/Admin
export const updateAdminProfile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin.id);

  if (admin) {
    admin.name = req.body.name || admin.name;

    if (req.body.password) {
      // Only update password if a new one is provided
      admin.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedAdmin = await admin.save();

    res.status(200).json({
      _id: updatedAdmin._id,
      name: updatedAdmin.name,
      email: updatedAdmin.email,
      createdAt: updatedAdmin.createdAt,
      message: 'Admin profile updated successfully',
    });
  } else {
    res.status(404);
    throw new Error('Admin not found');
  }
});


// @desc    Get specific user's bookings
// @route   GET /api/admin/users/:userId/bookings
// @access  Private/Admin
export const getUserBookings = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Validate userId
  if (!userId) {
    res.status(400);
    throw new Error('User ID is required');
  }

  // Check if user exists
  const userExists = await User.findById(userId);
  if (!userExists) {
    res.status(404);
    throw new Error('User not found');
  }

  // Fetch bookings with populated EV station details
  const bookings = await Booking.find({ userId })
    .populate({
      path: 'bunkId',
      model: 'EvBunk',
      select: 'name address phone latitude longitude operatingHours connectorTypes'
    })
    .sort({ createdAt: -1 }); // Most recent first

  res.status(200).json(bookings);
});

// @desc    Get specific user details
// @route   GET /api/admin/users/:userId
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Get booking count and recent activity
  const bookingCount = await Booking.countDocuments({ userId });
  const recentBookings = await Booking.find({ userId })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('bunkId', 'name address');

  const userWithStats = {
    ...user.toObject(),
    totalBookings: bookingCount,
    recentBookings,
    status: user.status || 'active'
  };

  res.status(200).json(userWithStats);
});

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalBookings = await Booking.countDocuments();
  const activeBookings = await Booking.countDocuments({ status: 'active' });
  const completedBookings = await Booking.countDocuments({ status: 'completed' });
  const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
  const totalStations = await EvBunk.countDocuments();

  // Recent users (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentUsers = await User.countDocuments({ 
    createdAt: { $gte: thirtyDaysAgo } 
  });

  // Recent bookings (last 30 days)
  const recentBookings = await Booking.countDocuments({ 
    createdAt: { $gte: thirtyDaysAgo } 
  });

  // Monthly growth
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  const monthlyUsers = await User.countDocuments({ 
    createdAt: { $gte: lastMonth } 
  });
  const monthlyBookings = await Booking.countDocuments({ 
    createdAt: { $gte: lastMonth } 
  });

  res.status(200).json({
    totalUsers,
    totalBookings,
    activeBookings,
    completedBookings,
    cancelledBookings,
    totalStations,
    recentUsers,
    recentBookings,
    monthlyUsers,
    monthlyBookings,
    timestamp: new Date()
  });
});

// @desc    Get user search results
// @route   GET /api/admin/users/search
// @access  Private/Admin
export const searchUsers = asyncHandler(async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    res.status(400);
    throw new Error('Search query is required');
  }

  const users = await User.find({
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } }
    ]
  }).select('-password').limit(20);

  res.status(200).json(users);
});

// @desc    Get booking analytics
// @route   GET /api/admin/bookings/analytics
// @access  Private/Admin
export const getBookingAnalytics = asyncHandler(async (req, res) => {
  const { period = '30' } = req.query; // Default to 30 days
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - parseInt(period));

  // Booking trends
  const bookingTrends = await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: daysAgo }
      }
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
        },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { "_id.date": 1 }
    }
  ]);

  // Popular stations
  const popularStations = await Booking.aggregate([
    {
      $match: {
        createdAt: { $gte: daysAgo }
      }
    },
    {
      $group: {
        _id: "$bunkId",
        bookingCount: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'evbunks', // Ensure this matches your actual collection name for EvBunkSchema
        localField: '_id',
        foreignField: '_id',
        as: 'station'
      }
    },
    {
      $unwind: '$station'
    },
    {
      $project: {
        stationName: '$station.name',
        address: '$station.address',
        bookingCount: 1
      }
    },
    {
      $sort: { bookingCount: -1 }
    },
    {
      $limit: 10
    }
  ]);

  res.status(200).json({
    period: parseInt(period),
    bookingTrends,
    popularStations
  });
});

// Updated getAllUsers function for admin controller
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.aggregate([
    {
      // Only get users that are not deleted (soft delete check)
      $match: {
        $or: [
          { deletedAt: null },
          { deletedAt: { $exists: false } }
        ]
      }
    },
    {
      $lookup: {
        from: 'bookings',
        localField: '_id',
        foreignField: 'userId',
        as: 'bookings'
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        status: 1,
        isActive: 1,
        lastLogin: 1,
        createdAt: 1,
        updatedAt: 1,
        totalBookings: { $size: '$bookings' }
      }
    },
    {
      $sort: { createdAt: -1 }
    }
  ]);

  res.status(200).json(users);
});

export const deleteUser = async (req, res) => {
  try {
    // FIXED: Handle both :userId and :id parameters
    const userId = req.params.userId || req.params.id;

    console.log('🔄 deleteUser called with:', {
      userId,
      params: req.params
    });

    if (!userId) {
      console.error('❌ No user ID provided');
      return res.status(400).json({ 
        message: 'User ID is required',
        error: 'MISSING_USER_ID'
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      console.error('❌ User not found:', userId);
      return res.status(404).json({ 
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    // Optional: Check for active bookings before deletion
    const activeBookings = await Booking.countDocuments({ 
      userId, 
      status: 'active' 
    });

    if (activeBookings > 0) {
      console.log('⚠️ User has active bookings:', { userId, activeBookings });
      return res.status(400).json({ 
        message: 'Cannot delete user with active bookings. Cancel bookings first.',
        error: 'ACTIVE_BOOKINGS_EXIST',
        activeBookings
      });
    }

    // Delete user and their bookings
    await Promise.all([
      User.findByIdAndDelete(userId),
      Booking.deleteMany({ userId })
    ]);

    console.log('✅ User deleted successfully:', { userId });

    res.json({ 
      message: 'User and associated data deleted successfully',
      deletedUserId: userId
    });

  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(500).json({ 
      message: 'Server error while deleting user',
      error: error.message 
    });
  }
};

// Updated updateUserStatus function
export const updateUserStatus = async (req, res) => {
  try {
    // FIXED: Handle both :userId and :id parameters
    const userId = req.params.userId || req.params.id;
    const { status } = req.body;

    console.log('🔄 updateUserStatus called with:', {
      userId,
      status,
      params: req.params,
      body: req.body
    });

    if (!userId) {
      console.error('❌ No user ID provided');
      return res.status(400).json({ 
        message: 'User ID is required',
        error: 'MISSING_USER_ID'
      });
    }

    if (!status) {
      console.error('❌ No status provided');
      return res.status(400).json({ 
        message: 'Status is required in request body',
        error: 'MISSING_STATUS'
      });
    }

    // Validate status
    const validStatuses = ['active', 'inactive', 'banned', 'suspended'];
    if (!validStatuses.includes(status.toLowerCase())) {
      console.error('❌ Invalid status:', status);
      return res.status(400).json({ 
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        error: 'INVALID_STATUS'
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      console.error('❌ User not found:', userId);
      return res.status(404).json({ 
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    // Update user status
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 
        status: status.toLowerCase(),
        isActive: status.toLowerCase() === 'active'
      },
      { new: true }
    ).select('-password');

    console.log('✅ User status updated successfully:', {
      userId,
      oldStatus: user.status,
      newStatus: updatedUser.status
    });

    res.json({ 
      message: `User status updated to ${status} successfully`,
      user: updatedUser
    });

  } catch (error) {
    console.error('❌ Error updating user status:', error);
    res.status(500).json({ 
      message: 'Server error while updating user status',
      error: error.message 
    });
  }
};
