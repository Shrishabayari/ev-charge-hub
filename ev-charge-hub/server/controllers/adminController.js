import Admin from "../models/Admin.js"; // Import the Admin model
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// controllers/adminController.js
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import EvBunk from '../models/EvBunkSchema.js';
import asyncHandler from 'express-async-handler';

// Register Admin
export const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully" });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin Login
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // JWT token generation
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "365d" } // token expires in 1 hour
    );

    res.status(200).json({ message: "Login successful", token });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};




export default {
  registerAdmin,
  loginAdmin,
};

// @desc    Get all users with booking counts
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    // Aggregate users with booking counts
    const users = await User.aggregate([
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
          createdAt: 1,
          totalBookings: { $size: '$bookings' },
          status: { $literal: 'active' } // You can modify this based on your user status logic
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      message: 'Error fetching users', 
      error: error.message 
    });
  }
});

// @desc    Get specific user's bookings
// @route   GET /api/admin/users/:userId/bookings
// @access  Private/Admin
export const getUserBookings = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
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
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ 
      message: 'Error fetching user bookings', 
      error: error.message 
    });
  }
});

// @desc    Get specific user details
// @route   GET /api/admin/users/:userId
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
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
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      message: 'Error fetching user', 
      error: error.message 
    });
  }
});

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      message: 'Error fetching statistics', 
      error: error.message 
    });
  }
});

// @desc    Update user status
// @route   PUT /api/admin/users/:userId/status
// @access  Private/Admin
export const updateUserStatus = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!['active', 'inactive', 'suspended'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be active, inactive, or suspended.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user status (you might need to add status field to User model)
    user.status = status;
    await user.save();

    // If suspending user, you might want to cancel their active bookings
    if (status === 'suspended') {
      await Booking.updateMany(
        { userId, status: 'active' },
        { status: 'cancelled' }
      );
    }

    res.status(200).json({ 
      message: 'User status updated successfully', 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ 
      message: 'Error updating user status', 
      error: error.message 
    });
  }
});

// @desc    Delete user (soft delete)
// @route   DELETE /api/admin/users/:userId
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Cancel all active bookings
    await Booking.updateMany(
      { userId, status: 'active' },
      { status: 'cancelled' }
    );

    // Soft delete - set status to inactive instead of actually deleting
    user.status = 'inactive';
    user.deletedAt = new Date();
    await user.save();

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ 
      message: 'Error deleting user', 
      error: error.message 
    });
  }
});

// @desc    Get user search results
// @route   GET /api/admin/users/search
// @access  Private/Admin
export const searchUsers = asyncHandler(async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const users = await User.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ]
    }).select('-password').limit(20);

    res.status(200).json(users);
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ 
      message: 'Error searching users', 
      error: error.message 
    });
  }
});

// @desc    Get booking analytics
// @route   GET /api/admin/bookings/analytics
// @access  Private/Admin
export const getBookingAnalytics = asyncHandler(async (req, res) => {
  try {
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
          from: 'evbunks',
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
  } catch (error) {
    console.error('Error fetching booking analytics:', error);
    res.status(500).json({ 
      message: 'Error fetching booking analytics', 
      error: error.message 
    });
  }
});