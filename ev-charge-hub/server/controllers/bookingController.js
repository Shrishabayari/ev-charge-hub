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
    
    // Parse the date and create start/end of day
    const selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime())) {
      return res.status(400).json({ success: false, message: 'Invalid date format' });
    }
    
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    // Find the bunk first to check if it exists
    const bunk = await Bunk.findById(bunkId);
    if (!bunk) {
      return res.status(404).json({ success: false, message: 'Bunk not found' });
    }
    
    // Find all active bookings for this bunk on this date
    const bookings = await Booking.find({
      bunkId,
      status: 'active',
      $or: [
        { startTime: { $gte: startOfDay, $lte: endOfDay } },
        { endTime: { $gte: startOfDay, $lte: endOfDay } },
        { startTime: { $lte: startOfDay }, endTime: { $gte: endOfDay } }
      ]
    }).sort({ startTime: 1 });
    
    // Get operating hours from the bunk or use default
    let operatingHours = bunk.operatingHours || "09:00-18:00";
    
    console.log("Operating hours:", operatingHours); // Debug log
    
    // Handle different operating hours formats
    let openHour = 9;
    let openMinute = 0;
    let closeHour = 18;
    let closeMinute = 0;
    
    // Check if format is "HH:MM-HH:MM"
    if (operatingHours.includes('-') && !operatingHours.includes('AM') && !operatingHours.includes('PM')) {
      let [openTime, closeTime] = operatingHours.split('-');
      if (openTime && closeTime) {
        [openHour, openMinute] = openTime.trim().split(':').map(Number);
        [closeHour, closeMinute] = closeTime.trim().split(':').map(Number);
      }
    } 
    // Check if format is "H:MM AM - H:MM PM"
    else if (operatingHours.includes(' - ') || operatingHours.includes('-')) {
      let parts = operatingHours.split(' - ');
      // If the split didn't work, try without spaces
      if (parts.length !== 2) {
        parts = operatingHours.split('-');
      }
      
      if (parts.length === 2) {
        let openTimePart = parts[0].trim();
        let closeTimePart = parts[1].trim();
        
        // Parse opening time
        let openTimeMatch = openTimePart.match(/(\d+):(\d+)\s*(AM|PM)?/i);
        if (openTimeMatch) {
          openHour = parseInt(openTimeMatch[1]);
          openMinute = parseInt(openTimeMatch[2]);
          // Handle AM/PM
          if (openTimeMatch[3] && openTimeMatch[3].toUpperCase() === 'PM' && openHour < 12) {
            openHour += 12;
          }
          if (openTimeMatch[3] && openTimeMatch[3].toUpperCase() === 'AM' && openHour === 12) {
            openHour = 0;
          }
        }
        
        // Parse closing time
        let closeTimeMatch = closeTimePart.match(/(\d+):(\d+)\s*(AM|PM)?/i);
        if (closeTimeMatch) {
          closeHour = parseInt(closeTimeMatch[1]);
          closeMinute = parseInt(closeTimeMatch[2]);
          // Handle AM/PM
          if (closeTimeMatch[3] && closeTimeMatch[3].toUpperCase() === 'PM' && closeHour < 12) {
            closeHour += 12;
          }
          if (closeTimeMatch[3] && closeTimeMatch[3].toUpperCase() === 'AM' && closeHour === 12) {
            closeHour = 0;
          }
        }
      }
    }

    console.log(`Parsed operating hours: ${openHour}:${openMinute} to ${closeHour}:${closeMinute}`); // Debug log
    
    // Generate time slots (1-hour slots)
    const availableSlots = [];
    const startTime = new Date(selectedDate);
    startTime.setHours(openHour, openMinute, 0, 0);
    
    const endTime = new Date(selectedDate);
    endTime.setHours(closeHour, closeMinute, 0, 0);
    
    // Create slots every hour
    while (startTime < endTime) {
      const currentSlotStart = new Date(startTime);
      const currentSlotEnd = new Date(startTime);
      currentSlotEnd.setHours(currentSlotStart.getHours() + 1);
      
      // Check if this time slot conflicts with any booking
      const isBooked = bookings.some(booking => {
        const bookingStart = new Date(booking.startTime);
        const bookingEnd = new Date(booking.endTime);
        
        return (
          // Slot start time falls within booking
          (currentSlotStart >= bookingStart && currentSlotStart < bookingEnd) ||
          // Slot end time falls within booking
          (currentSlotEnd > bookingStart && currentSlotEnd <= bookingEnd) ||
          // Booking is fully contained in slot
          (currentSlotStart <= bookingStart && currentSlotEnd >= bookingEnd)
        );
      });
      
      if (!isBooked) {
        // Add as available slot
        availableSlots.push(currentSlotStart.toISOString());
      }
      
      // Move to next slot
      startTime.setHours(startTime.getHours() + 1);
    }
    
    console.log(`Generated ${availableSlots.length} available slots`); // Debug log
    
    res.json({
      success: true,
      data: {
        bookings,
        availableSlots, // These are the slots that are available
        bunkInfo: {
          name: bunk.name,
          operatingHours
        }
      }
    });
  } catch (error) {
    console.error('Error in getAvailableSlots:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};