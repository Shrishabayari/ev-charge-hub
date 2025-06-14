
// controllers/bookingController.js
import Booking from '../models/Booking.js';
import Bunk from '../models/EvBunkSchema.js';
import User from '../models/User.js';

// Get all bookings (Admin only)
export const getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, startDate, endDate, search } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query object
    let query = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) {
        query.startTime.$gte = new Date(startDate);
      }
      if (endDate) {
        query.startTime.$lte = new Date(endDate);
      }
    }

    // Search functionality (search in user email/name or bunk name)
    if (search) {
      // This requires lookup to search in related collections
      const searchRegex = new RegExp(search, 'i');
      
      // First find users matching the search
      const matchingUsers = await User.find({
        $or: [
          { email: searchRegex },
          { name: searchRegex }
        ]
      }).select('_id');

      // Find bunks matching the search
      const matchingBunks = await Bunk.find({
        name: searchRegex
      }).select('_id');

      query.$or = [
        { userId: { $in: matchingUsers.map(u => u._id) } },
        { bunkId: { $in: matchingBunks.map(b => b._id) } }
      ];
    }

    // Get total count for pagination
    const total = await Booking.countDocuments(query);

    // Fetch bookings with pagination and populate related data
    const bookings = await Booking.find(query)
      .populate('userId', 'name email phone')
      .populate('bunkId', 'name location address connectorType powerOutput')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: {
        bookings,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          total,
          hasNextPage: pageNum < Math.ceil(total / limitNum),
          hasPrevPage: pageNum > 1
        }
      }
    });
  } catch (error) {
    console.error('Error in getAllBookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message
    });
  }
};

// Get booking statistics (Admin only)
export const getBookingStats = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Get various statistics
    const [
      totalBookings,
      activeBookings,
      completedBookings,
      cancelledBookings,
      todayBookings,
      weekBookings,
      monthBookings,
      recentBookings
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'active' }),
      Booking.countDocuments({ status: 'completed' }),
      Booking.countDocuments({ status: 'cancelled' }),
      Booking.countDocuments({ createdAt: { $gte: startOfDay } }),
      Booking.countDocuments({ createdAt: { $gte: startOfWeek } }),
      Booking.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Booking.find()
        .populate('userId', 'name email')
        .populate('bunkId', 'name location')
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    // Calculate revenue (if you have pricing in your booking model)
    const revenueData = await Booking.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalBookings,
          activeBookings,
          completedBookings,
          cancelledBookings,
          totalRevenue
        },
        timeBasedStats: {
          today: todayBookings,
          thisWeek: weekBookings,
          thisMonth: monthBookings
        },
        recentBookings
      }
    });
  } catch (error) {
    console.error('Error in getBookingStats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking statistics',
      error: error.message
    });
  }
};

// Get specific booking details (Admin only)
export const getBookingDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate('userId', 'name email phone')
      .populate('bunkId', 'name location address connectorType powerOutput pricePerHour');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error in getBookingDetails:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking details',
      error: error.message
    });
  }
};

// Update booking status (Admin only)
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'active', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: ' + validStatuses.join(', ')
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { 
        status,
        updatedAt: new Date()
      },
      { new: true }
    ).populate('userId', 'name email')
     .populate('bunkId', 'name location');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: booking
    });
  } catch (error) {
    console.error('Error in updateBookingStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: error.message
    });
  }
};

// Get bookings by bunk (Public)
export const getBookingsByBunk = async (req, res) => {
  try {
    const { bunkId } = req.params;
    const bookings = await Booking.find({ bunkId, status: { $ne: 'cancelled' } })
      .populate('userId', 'name email')
      .sort({ startTime: 1 });

    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    console.error('Error in getBookingsByBunk:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings for this bunk',
      error: error.message
    });
  }
};

// Create new booking (Authenticated users)
export const createBooking = async (req, res) => {
  try {
    const { bunkId, startTime, endTime, vehicleDetails } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!bunkId || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Bunk ID, start time, and end time are required'
      });
    }

    // Check if bunk exists
    const bunk = await Bunk.findById(bunkId);
    if (!bunk) {
      return res.status(404).json({
        success: false,
        message: 'Bunk not found'
      });
    }

    // Check for conflicts
    const conflictingBooking = await Booking.findOne({
      bunkId,
      status: { $in: ['active', 'pending'] },
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } },
        { endTime: { $gt: startTime, $lte: endTime } },
        { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
      ]
    });

    if (conflictingBooking) {
      return res.status(409).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    // Calculate duration and total amount
    const duration = new Date(endTime) - new Date(startTime);
    const hours = duration / (1000 * 60 * 60);
    const totalAmount = hours * (bunk.pricePerHour || 0);

    const booking = new Booking({
      userId,
      bunkId,
      startTime,
      endTime,
      vehicleDetails,
      totalAmount,
      status: 'pending'
    });

    await booking.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('userId', 'name email')
      .populate('bunkId', 'name location');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: populatedBooking
    });
  } catch (error) {
    console.error('Error in createBooking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    });
  }
};

// Get user's bookings (Authenticated users)
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;

    let query = { userId };
    if (status) {
      query.status = status;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Booking.countDocuments(query);
    const bookings = await Booking.find(query)
      .populate('bunkId', 'name location address connectorType powerOutput')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: {
        bookings,
        pagination: {
          currentPage: pageNum,
          totalPages: Math.ceil(total / limitNum),
          total,
          hasNextPage: pageNum < Math.ceil(total / limitNum),
          hasPrevPage: pageNum > 1
        }
      }
    });
  } catch (error) {
    console.error('Error in getUserBookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your bookings',
      error: error.message
    });
  }
};

// Cancel booking (Authenticated users)
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findOne({ _id: id, userId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or unauthorized'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed booking'
      });
    }

    booking.status = 'cancelled';
    booking.updatedAt = new Date();
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error in cancelBooking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message
    });
  }
};

// Reschedule booking (Authenticated users)
export const rescheduleBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { startTime, endTime } = req.body;
    const userId = req.user.id;

    const booking = await Booking.findOne({ _id: id, userId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or unauthorized'
      });
    }

    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot reschedule cancelled or completed booking'
      });
    }

    // Check for conflicts (excluding current booking)
    const conflictingBooking = await Booking.findOne({
      _id: { $ne: id },
      bunkId: booking.bunkId,
      status: { $in: ['active', 'pending'] },
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } },
        { endTime: { $gt: startTime, $lte: endTime } },
        { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
      ]
    });

    if (conflictingBooking) {
      return res.status(409).json({
        success: false,
        message: 'The new time slot is already booked'
      });
    }

    // Recalculate total amount
    const bunk = await Bunk.findById(booking.bunkId);
    const duration = new Date(endTime) - new Date(startTime);
    const hours = duration / (1000 * 60 * 60);
    const totalAmount = hours * (bunk.pricePerHour || 0);

    booking.startTime = startTime;
    booking.endTime = endTime;
    booking.totalAmount = totalAmount;
    booking.updatedAt = new Date();
    await booking.save();

    const updatedBooking = await Booking.findById(booking._id)
      .populate('bunkId', 'name location');

    res.status(200).json({
      success: true,
      message: 'Booking rescheduled successfully',
      data: updatedBooking
    });
  } catch (error) {
    console.error('Error in rescheduleBooking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reschedule booking',
      error: error.message
    });
  }
};

// Check slot availability (Public)
export const checkSlotAvailability = async (req, res) => {
  try {
    const { bunkId, startTime, endTime } = req.body;

    if (!bunkId || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Bunk ID, start time, and end time are required'
      });
    }

    const conflictingBooking = await Booking.findOne({
      bunkId,
      status: { $in: ['active', 'pending'] },
      $or: [
        { startTime: { $lt: endTime, $gte: startTime } },
        { endTime: { $gt: startTime, $lte: endTime } },
        { startTime: { $lte: startTime }, endTime: { $gte: endTime } }
      ]
    });

    res.status(200).json({
      success: true,
      available: !conflictingBooking,
      message: conflictingBooking ? 'Time slot is not available' : 'Time slot is available'
    });
  } catch (error) {
    console.error('Error in checkSlotAvailability:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check slot availability',
      error: error.message
    });
  }
};

// Get available slots for a bunk on a specific date (Public)
export const getAvailableSlots = async (req, res) => {
  try {
    const { bunkId, date } = req.params;

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookedSlots = await Booking.find({
      bunkId,
      status: { $in: ['active', 'pending'] },
      $or: [
        { startTime: { $gte: startOfDay, $lte: endOfDay } },
        { endTime: { $gte: startOfDay, $lte: endOfDay } },
        { startTime: { $lt: startOfDay }, endTime: { $gt: endOfDay } }
      ]
    }).select('startTime endTime');

    // Generate available slots (this is a simplified version)
    // You might want to implement more sophisticated slot generation
    const availableSlots = [];
    const slotDuration = 60; // 1 hour slots
    
    for (let hour = 6; hour <= 22; hour++) { // 6 AM to 10 PM
      const slotStart = new Date(startOfDay);
      slotStart.setHours(hour);
      const slotEnd = new Date(slotStart);
      slotEnd.setMinutes(slotStart.getMinutes() + slotDuration);

      const isBooked = bookedSlots.some(booking => 
        (slotStart >= booking.startTime && slotStart < booking.endTime) ||
        (slotEnd > booking.startTime && slotEnd <= booking.endTime) ||
        (slotStart <= booking.startTime && slotEnd >= booking.endTime)
      );

      if (!isBooked) {
        availableSlots.push({
          startTime: slotStart,
          endTime: slotEnd
        });
      }
    }

    res.status(200).json({
      success: true,
      data: availableSlots
    });
  } catch (error) {
    console.error('Error in getAvailableSlots:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available slots',
      error: error.message
    });
  }
};