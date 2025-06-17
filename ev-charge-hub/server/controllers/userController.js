import User from '../models/User.js';
import asyncHandler from 'express-async-handler'; // Used for catching async errors
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Booking from '../models/Booking.js'; // Assuming you have a Booking model

// =====================================================================
// EXISTING USER CONTROLLER FUNCTIONS
// =====================================================================

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      status: 'active', // Set default status
      isActive: true,
      role: 'user', // Default role for new registrations
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        status: newUser.status,
        role: newUser.role, // Include role in response
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Check if user is active (considering banned/deleted states)
    if (user.status === 'banned' || !user.isActive || user.deletedAt) {
      return res.status(403).json({ message: 'Account is inactive, suspended, or banned. Please contact support.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { // Include role in token
      expiresIn: '365d',
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        role: user.role, // Include role in response
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id); // req.user.id typically comes from auth middleware

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email; // Allow email update

    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        status: updatedUser.status,
        role: updatedUser.role,
      },
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// =====================================================================
// NEW ADMIN-SPECIFIC USER MANAGEMENT FUNCTIONS
// These typically require admin role authentication middleware
// =====================================================================

// @desc    Get all users (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  // IMPORTANT: You'll need middleware here to check if the requesting user is an admin.
  // Example: req.user.role === 'admin'
  // If not using middleware, you'd check it here:
  // if (req.user.role !== 'admin') {
  //   res.status(403);
  //   throw new Error('Not authorized as an admin');
  // }

  const users = await User.find({})
    .select('-password -__v') // Exclude sensitive fields
    .lean(); // Return plain JavaScript objects for performance

  // Add totalBookings to each user object (optional, but good for frontend)
  // This can be optimized if you store totalBookings directly on the User model
  const usersWithBookings = await Promise.all(users.map(async user => {
    const totalBookings = await Booking.countDocuments({ user: user._id });
    return { ...user, totalBookings };
  }));


  res.status(200).json(usersWithBookings);
});

// @desc    Search users (Admin only)
// @route   GET /api/admin/users/search?q=query
// @access  Private/Admin
export const searchUsers = asyncHandler(async (req, res) => {
  // Check for admin role (middleware or here)

  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ message: 'Search query parameter "q" is required.' });
  }

  const users = await User.find({
    $or: [
      { name: { $regex: query, $options: 'i' } }, // Case-insensitive name search
      { email: { $regex: query, $options: 'i' } }  // Case-insensitive email search
    ]
  })
    .select('-password -__v')
    .lean();

  const usersWithBookings = await Promise.all(users.map(async user => {
    const totalBookings = await Booking.countDocuments({ user: user._id });
    return { ...user, totalBookings };
  }));

  res.status(200).json(usersWithBookings);
});


// @desc    Get a single user's bookings (Admin only)
// @route   GET /api/admin/users/:id/bookings
// @access  Private/Admin
export const getUserBookings = asyncHandler(async (req, res) => {
  // Check for admin role (middleware or here)

  const userId = req.params.id;

  const bookings = await Booking.find({ user: userId })
    .populate('bunkId', 'name address') // Populate bunk details
    .sort({ createdAt: -1 }); // Sort by newest first

  if (!bookings) {
    return res.status(404).json({ message: 'No bookings found for this user.' });
  }

  res.status(200).json(bookings);
});


// @desc    Update user status (Admin only)
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
export const updateUserStatus = asyncHandler(async (req, res) => {
  // Check for admin role (middleware or here)

  const { status } = req.body;
  const userId = req.params.id;

  if (!['active', 'inactive', 'suspended', 'banned'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status provided.' });
  }

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.status = status;
  // Also update isActive based on status for consistency
  user.isActive = (status === 'active');

  const updatedUser = await user.save();

  res.json({
    message: `User status updated to ${status} successfully.`,
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      status: updatedUser.status,
      isActive: updatedUser.isActive,
    },
  });
});

// @desc    Delete a user (Admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  // Check for admin role (middleware or here)

  const userId = req.params.id;

  const user = await User.findById(userId);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // OPTION 1: Hard Delete (permanently remove from DB)
  await User.deleteOne({ _id: userId });
  // Also delete their bookings if desired
  await Booking.deleteMany({ user: userId });

  res.json({ message: 'User and associated data deleted successfully' });

  /*
  // OPTION 2: Soft Delete (recommended for data integrity, e.g., if bookings should persist)
  user.deletedAt = new Date();
  user.isActive = false;
  user.status = 'banned'; // Or 'deleted'
  await user.save();
  res.json({ message: 'User soft-deleted successfully' });
  */
});