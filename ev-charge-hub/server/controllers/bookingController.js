import Booking from '../models/Booking.js';

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { userId, bunkId, slotTime } = req.body;
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
      const bookings = await Booking.find({ bunkId }).populate('userId');
      res.status(200).json({ success: true, bookings });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
// Get all bookings for a user
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookings = await Booking.find({ userId }).populate('bunkId');
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel a booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );
    res.status(200).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reschedule a booking
export const rescheduleBooking = async (req, res) => {
  try {
    const { newSlotTime } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { slotTime: newSlotTime, status: 'rescheduled' },
      { new: true }
    );
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
        slotTime: new Date(slotTime),
        status: 'booked',
      });
  
      if (existingBooking) {
        return res.status(400).json({ available: false, message: "Slot already booked" });
      }
  
      res.status(200).json({ available: true });
    } catch (error) {
      res.status(500).json({ available: false, message: error.message });
    }
  };
  