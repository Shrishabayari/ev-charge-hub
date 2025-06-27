import Booking from '../models/Booking.js';
import Bunk from '../models/EvBunkSchema.js';
import { validationResult } from 'express-validator';

export const getBookingsByBunk = async (req, res) => {
  try {
    const { bunkId } = req.params;
    
    if (!bunkId) {
      return res.status(400).json({ success: false, message: 'Bunk ID is required' });
    }
    
    const bookings = await Booking.find({ bunkId }).populate('userId', 'name email');
    
    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error('Error in getBookingsByBunk:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Handle both formats of request body
    const { bunkId, slotTime, startTime, endTime } = req.body;
    
    // If slotTime is provided, parse it to get startTime and endTime
    let bookingStartTime = startTime;
    let bookingEndTime = endTime;
    
    if (slotTime && !startTime) {
      // Parse the slot time to get start time
      bookingStartTime = new Date(slotTime);
      
      // Assume each slot is 1 hour
      bookingEndTime = new Date(bookingStartTime);
      bookingEndTime.setHours(bookingEndTime.getHours() + 1);
    }
    
    // Check if bunk exists
    const bunk = await Bunk.findById(bunkId);
    if (!bunk) {
      return res.status(404).json({ success: false, message: 'Bunk not found' });
    }
    
    // Create new booking
    const newBooking = new Booking({
      userId: req.user.id, // From auth middleware
      bunkId,
      startTime: bookingStartTime,
      endTime: bookingEndTime,
      status: 'active'
    });
    
    const savedBooking = await newBooking.save();
    
    // Populate the bunk details in the response
    const populatedBooking = await Booking.findById(savedBooking._id)
      .populate('bunkId', 'name address');
    
    res.status(201).json({ 
      success: true, 
      message: 'Booking created successfully', 
      data: populatedBooking 
    });
  } catch (error) {
    console.error('Error in createBooking:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    // More robust user ID validation
    if (!req.user || !req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user authentication'
      });
    }

    // Fetch bookings with comprehensive population
    const bookings = await Booking.find({ userId: req.user.id })
      .populate({
        path: 'bunkId',
        select: 'name address _id'
      })
      .sort({ startTime: -1 })
      .lean();

    // Explicit JSON serialization
    const sanitizedBookings = bookings.map(booking => ({
      _id: booking._id.toString(),
      userId: booking.userId.toString(),
      bunkId: booking.bunkId ? {
        _id: booking.bunkId._id.toString(),
        name: booking.bunkId.name || 'Unknown Station',
        location: booking.bunkId.address || 'Not specified'
      } : null,
      startTime: booking.startTime,
      endTime: booking.endTime,
      status: booking.status,
      createdAt: booking.createdAt
    }));

    // Send response with explicit JSON serialization
    res.json({ 
      success: true,
      data: sanitizedBookings
    });
  } catch (error) {
    console.error('Booking Fetch Error:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });

    res.status(500).json({ 
      success: false, 
      message: 'Unable to fetch bookings',
      error: error.message 
    });
  }
};

// Cancel a booking
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the booking
    const booking = await Booking.findById(id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    // Check if the booking belongs to the current user
    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }
    
    // Check if booking is already cancelled or completed
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return res.status(400).json({ 
        success: false, 
        message: `Booking already ${booking.status}` 
      });
    }
    
    // Update booking status
    booking.status = 'cancelled';
    await booking.save();
    
    res.json({ 
      success: true, 
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error in cancelBooking:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Reschedule a booking
export const rescheduleBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { startTime, endTime, slotTime } = req.body;
    
    let bookingStartTime = startTime;
    let bookingEndTime = endTime;
    
    if (slotTime && !startTime) {
      // Parse the slot time to get start time
      bookingStartTime = new Date(slotTime);
      
      // Assume each slot is 1 hour
      bookingEndTime = new Date(bookingStartTime);
      bookingEndTime.setHours(bookingEndTime.getHours() + 1);
    }
    
    if (!bookingStartTime || !bookingEndTime) {
      return res.status(400).json({ 
        success: false, 
        message: 'Start time and end time are required' 
      });
    }
    
    // Find the booking
    const booking = await Booking.findById(id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    // Check if the booking belongs to the current user
    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to reschedule this booking' 
      });
    }
    
    // Check if booking is already cancelled or completed
    if (booking.status === 'cancelled' || booking.status === 'completed') {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot reschedule a ${booking.status} booking` 
      });
    }
    
    // Update booking times
    booking.startTime = bookingStartTime;
    booking.endTime = bookingEndTime;
    await booking.save();
    
    // Return the updated booking with populated bunk details
    const updatedBooking = await Booking.findById(id).populate('bunkId', 'name address');
    
    res.json({ 
      success: true, 
      message: 'Booking rescheduled successfully',
      data: updatedBooking
    });
  } catch (error) {
    console.error('Error in rescheduleBooking:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Check if a slot is available
export const checkSlotAvailability = async (req, res) => {
  try {
    const { bunkId, startTime, endTime, slotTime } = req.body;
    
    let bookingStartTime = startTime;
    let bookingEndTime = endTime;
    
    if (slotTime && !startTime) {
      // Parse the slot time to get start time
      bookingStartTime = new Date(slotTime);
      
      // Assume each slot is 1 hour
      bookingEndTime = new Date(bookingStartTime);
      bookingEndTime.setHours(bookingEndTime.getHours() + 1);
    }
    
    if (!bunkId || !bookingStartTime || !bookingEndTime) {
      return res.status(400).json({ 
        success: false, 
        message: 'Bunk ID, start time, and end time are required' 
      });
    }
    
    // Check for overlapping bookings
    const overlappingBookings = await Booking.find({
      bunkId,
      status: 'active',
      $or: [
        // Case 1: startTime falls within an existing booking
        { startTime: { $lte: bookingStartTime }, endTime: { $gt: bookingStartTime } },
        // Case 2: endTime falls within an existing booking
        { startTime: { $lt: bookingEndTime }, endTime: { $gte: bookingEndTime } },
        // Case 3: booking entirely contains the time period
        { startTime: { $gte: bookingStartTime }, endTime: { $lte: bookingEndTime } }
      ]
    });
    
    const isAvailable = overlappingBookings.length === 0;
    
    res.json({ 
      success: true, 
      data: { 
        available: isAvailable,
        conflictingBookings: isAvailable ? [] : overlappingBookings
      }
    });
  } catch (error) {
    console.error('Error in checkSlotAvailability:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

export const getAvailableSlots = async (req, res) => {
  try {
    const { bunkId, date } = req.params;

    if (!bunkId || !date) {
      return res.status(400).json({ success: false, message: 'Bunk ID and date are required' });
    }

    const selectedDate = new Date(date);
    const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

    const bookings = await Booking.find({
      bunkId,
      startTime: { $gte: startOfDay, $lte: endOfDay }
    });

    const bookedSlots = bookings.map((booking) => {
      const date = new Date(booking.startTime);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    });

    const availableSlots = [];
    for (let hour = 9; hour < 20; hour++) {
      const slot = `${hour.toString().padStart(2, '0')}:00`;
      if (!bookedSlots.includes(slot)) {
        availableSlots.push(slot);
      }
    }

    return res.status(200).json({
      success: true,
      data: { availableSlots }
    });
  } catch (err) {
    console.error("Error fetching available slots:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    console.log('getAllBookings called by user:', req.user);
    
    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Filtering parameters
    const { status, startDate, endDate, userId, bunkId, search } = req.query;
    
    console.log('Query parameters:', { status, startDate, endDate, userId, bunkId, search, page, limit });
    
    // Build filter object
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (startDate && endDate) {
      filter.startTime = { 
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (startDate) {
      filter.startTime = { $gte: new Date(startDate) };
    } else if (endDate) {
      filter.startTime = { $lte: new Date(endDate) };
    }
    
    if (userId) {
      filter.userId = userId;
    }
    
    if (bunkId) {
      filter.bunkId = bunkId;
    }
    
    console.log('Applied filter:', filter);
    
    // Count total documents for pagination
    const totalBookings = await Booking.countDocuments(filter);
    console.log('Total bookings found:', totalBookings);
    
    let bookings;
    
    // If there's a search parameter, use aggregation
    if (search && search.trim()) {
      console.log('Using search aggregation for:', search);
      
      const aggregationPipeline = [
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userDetails'
          }
        },
        {
          $lookup: {
            from: 'evbunks', // Make sure this matches your actual collection name
            localField: 'bunkId',
            foreignField: '_id',
            as: 'bunkDetails'
          }
        },
        {
          $match: {
            $and: [
              filter, // Apply other filters
              {
                $or: [
                  { 'userDetails.name': { $regex: search, $options: 'i' } },
                  { 'userDetails.email': { $regex: search, $options: 'i' } },
                  { 'bunkDetails.name': { $regex: search, $options: 'i' } },
                  { 'bunkDetails.address': { $regex: search, $options: 'i' } }
                ]
              }
            ]
          }
        },
        {
          $addFields: {
            userId: { $arrayElemAt: ['$userDetails', 0] },
            bunkId: { $arrayElemAt: ['$bunkDetails', 0] }
          }
        },
        {
          $project: {
            _id: 1,
            userId: {
              _id: '$userId._id',
              name: '$userId.name',
              email: '$userId.email'
            },
            bunkId: {
              _id: '$bunkId._id',
              name: '$bunkId.name',
              address: '$bunkId.address'
            },
            startTime: 1,
            endTime: 1,
            status: 1,
            createdAt: 1,
            updatedAt: 1
          }
        },
        { $sort: { startTime: -1 } },
        { $skip: skip },
        { $limit: limit }
      ];
      
      bookings = await Booking.aggregate(aggregationPipeline);
    } else {
      // Regular query without search
      console.log('Using regular query without search');
      
      bookings = await Booking.find(filter)
        .sort({ startTime: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email phone')
        .populate('bunkId', 'name address coordinates')
        .lean(); // Use lean() for better performance
    }
    
    console.log(`Found ${bookings.length} bookings for current page`);
    
    // Calculate pagination info
    const totalPages = Math.ceil(totalBookings / limit);
    
    // Send the response
    res.json({
      success: true,
      data: {
        bookings,
        pagination: {
          total: totalBookings,
          page,
          limit,
          pages: totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Error in getAllBookings:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
};

// Get booking statistics for admin dashboard
export const getBookingStats = async (req, res) => {
  try {
    const { timeframe } = req.query; // 'daily', 'weekly', 'monthly'
    
    console.log('Getting booking stats for timeframe:', timeframe);
    
    // Get the current date and time
    const now = new Date();
    let startDate;
    
    // Set the start date based on the timeframe
    if (timeframe === 'weekly') {
      // Get data for the past 7 days
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
    } else if (timeframe === 'monthly') {
      // Get data for the past 30 days
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 30);
    } else {
      // Default to daily (past 24 hours)
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 1);
    }
    
    // Get counts by status
    const statusCount = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Format status count
    const bookingsByStatus = statusCount.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, { active: 0, cancelled: 0, completed: 0 });
    
    // Get counts by bunk
    const bunkCount = await Booking.aggregate([
      {
        $lookup: {
          from: 'evbunks', // Use your actual collection name
          localField: 'bunkId',
          foreignField: '_id',
          as: 'bunkDetails'
        }
      },
      {
        $group: {
          _id: '$bunkId',
          count: { $sum: 1 },
          bunkName: { $first: { $arrayElemAt: ['$bunkDetails.name', 0] } }
        }
      },
      {
        $project: {
          _id: 1,
          count: 1,
          bunkName: 1
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);
    
    // Get bookings over time for chart
    let timeGrouping;
    let dateFormat;
    
    if (timeframe === 'monthly') {
      timeGrouping = { $dateToString: { format: '%Y-%m-%d', date: '$startTime' } };
      dateFormat = '%Y-%m-%d';
    } else if (timeframe === 'weekly') {
      timeGrouping = { $dateToString: { format: '%Y-%m-%d', date: '$startTime' } };
      dateFormat = '%Y-%m-%d';
    } else {
      // Daily view - group by hour
      timeGrouping = { $dateToString: { format: '%Y-%m-%d %H:00', date: '$startTime' } };
      dateFormat = '%Y-%m-%d %H:00';
    }
    
    const bookingsOverTime = await Booking.aggregate([
      {
        $match: {
          startTime: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            timeGroup: timeGrouping,
            status: '$status'
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.timeGroup': 1 }
      }
    ]);
    
    // Process the time series data
    const timeSeriesData = {};
    
    bookingsOverTime.forEach(item => {
      const timeKey = item._id.timeGroup;
      const status = item._id.status;
      
      if (!timeSeriesData[timeKey]) {
        timeSeriesData[timeKey] = {
          timePoint: timeKey,
          active: 0,
          cancelled: 0,
          completed: 0
        };
      }
      
      timeSeriesData[timeKey][status] = item.count;
    });
    
    // Convert to array
    const chartData = Object.values(timeSeriesData);
    
    // Get total bookings count
    const totalBookings = await Booking.countDocuments();
    
    // Get today's bookings count
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    
    const todayBookings = await Booking.countDocuments({
      startTime: { $gte: todayStart, $lte: todayEnd }
    });
    
    console.log('Booking stats generated successfully');
    
    // Send the response
    res.json({
      success: true,
      data: {
        totalBookings,
        todayBookings,
        bookingsByStatus,
        topBunks: bunkCount,
        chartData
      }
    });
  } catch (error) {
    console.error('Error in getBookingStats:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Admin function to update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log(`Updating booking ${id} status to ${status} by user:`, req.user);
    
    // Validate status
    const validStatuses = ['active', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status value. Status must be active, cancelled, or completed' 
      });
    }
    
    // Find and update the booking
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('userId', 'name email')
     .populate('bunkId', 'name address');
    
    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }
    
    console.log('Booking status updated successfully:', booking);
    
    res.json({ 
      success: true, 
      message: `Booking status updated to ${status}`,
      data: booking
    });
  } catch (error) {
    console.error('Error in updateBookingStatus:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
};

// Admin function to get a specific booking with detailed info
export const getBookingDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`Getting booking details for ID: ${id} by user:`, req.user);
    
    const booking = await Booking.findById(id)
      .populate('userId', 'name email phone')
      .populate('bunkId', 'name address coordinates operatingHours')
      .lean();
    
    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: 'Booking not found' 
      });
    }
    
    console.log('Booking details found:', booking);
    
    res.json({ 
      success: true, 
      data: booking 
    });
  } catch (error) {
    console.error('Error in getBookingDetails:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
};