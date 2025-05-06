import Booking from '../models/Booking.js';
import Bunk from '../models/EvBunkSchema.js'; // Assuming you have a Bunk model

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { bunkId, slotTime } = req.body;
    const userId = req.user.id; // Get userId from the authenticated user
    
    // Check if slot is available
    const existingBooking = await Booking.findOne({
      bunkId,
      slotTime,
      status: 'booked'
    });
    
    if (existingBooking) {
      return res.status(400).json({ 
        success: false, 
        message: "This slot is already booked" 
      });
    }
    
    // Create the booking
    const booking = new Booking({ userId, bunkId, slotTime });
    await booking.save();
    
    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all bookings for a specific bunk (admin)
export const getBookingsByBunk = async (req, res) => {
  try {
    const bunkId = req.params.bunkId;
    const bookings = await Booking.find({ bunkId })
      .populate('userId', 'name email') // Only get necessary user fields
      .sort({ slotTime: 1 }); // Sort by slot time
      
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all bookings for a user
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id; // Get from authenticated user
    
    const bookings = await Booking.find({ userId })
      .populate('bunkId', 'name location') // Get bunk details
      .sort({ slotTime: 1 }); // Sort by slot time
      
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel a booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    
    // Check if user owns this booking
    if (booking.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }
    
    booking.status = 'cancelled';
    await booking.save();
    
    res.status(200).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reschedule a booking
export const rescheduleBooking = async (req, res) => {
  try {
    const { newSlotTime } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    
    // Check if user owns this booking
    if (booking.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }
    
    // Check if new slot is available
    const existingBooking = await Booking.findOne({
      bunkId: booking.bunkId,
      slotTime: newSlotTime,
      status: 'booked',
      _id: { $ne: booking._id } // Exclude current booking
    });
    
    if (existingBooking) {
      return res.status(400).json({ 
        success: false, 
        message: "New slot is already booked" 
      });
    }
    
    booking.slotTime = newSlotTime;
    booking.status = 'rescheduled';
    await booking.save();
    
    res.status(200).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Check if a slot is available for booking
export const checkSlotAvailability = async (req, res) => {
  try {
    const { bunkId, slotTime } = req.body;
    
    // Check if any booking exists at that slot
    const existingBooking = await Booking.findOne({
      bunkId,
      slotTime,
      status: 'booked',
    });
    
    if (existingBooking) {
      return res.status(200).json({ 
        available: false, 
        message: "Slot already booked" 
      });
    }
    
    res.status(200).json({ available: true });
  } catch (error) {
    res.status(500).json({ 
      available: false, 
      message: error.message 
    });
  }
};

// Get available slots for a bunk
export const getAvailableSlots = async (req, res) => {
  try {
    const { bunkId, date } = req.params;
    
    // Get the bunk to check its operating hours
    const bunk = await Bunk.findById(bunkId);
    if (!bunk) {
      return res.status(404).json({ success: false, message: "Bunk not found" });
    }
    
    // Get start and end of the requested date
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    // Get all bookings for this bunk on this date
    const bookings = await Booking.find({
      bunkId,
      status: 'booked',
      slotTime: {
        $gte: startDate.toISOString().split('T')[0],
        $lte: endDate.toISOString().split('T')[0]
      }
    });
    
    // Assuming slots are 30 minutes each and bunk operates from 6AM to 10PM
    const startHour = 6; // 6 AM
    const endHour = 22; // 10 PM
    const slotDuration = 30; // minutes
    
    // Generate all possible slots
    const allSlots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const slotTime = `${date}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        allSlots.push(slotTime);
      }
    }
    
    // Filter out booked slots
    const bookedSlotTimes = bookings.map(booking => booking.slotTime);
    const availableSlots = allSlots.filter(slot => !bookedSlotTimes.includes(slot));
    
    res.status(200).json({ success: true, availableSlots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};