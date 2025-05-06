import Booking from '../models/Booking.js';
import EvBunk from '../models/EvBunkSchema.js'; // Correct bunk model

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { bunkId, slotTime } = req.body;
    const userId = req.user.id;

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
      .populate('userId', 'name email')
      .sort({ slotTime: 1 });

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all bookings for a user
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await Booking.find({ userId })
      .populate('bunkId', 'name')
      .sort({ createdAt: -1 });

    const formattedBookings = bookings.map(booking => {
      const [date, timeRange] = booking.slotTime.split(' ');
      const [startHour, endHour] = timeRange.split('-');

      const startTime = new Date(`${date}T${startHour}`);
      const endTime = new Date(`${date}T${endHour}`);

      let frontendStatus;
      switch (booking.status) {
        case 'booked':
          frontendStatus = 'active';
          break;
        case 'cancelled':
          frontendStatus = 'cancelled';
          break;
        case 'rescheduled':
          frontendStatus = 'active';
          break;
        default:
          frontendStatus = 'active';
      }

      return {
        _id: booking._id,
        bunkId: {
          _id: booking.bunkId._id,
          name: booking.bunkId.name
        },
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        status: frontendStatus,
        createdAt: booking.createdAt
      };
    });

    res.status(200).json(formattedBookings);
  } catch (error) {
    console.error('Error in getUserBookings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel a booking
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

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

    if (booking.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const existingBooking = await Booking.findOne({
      bunkId: booking.bunkId,
      slotTime: newSlotTime,
      status: 'booked',
      _id: { $ne: booking._id }
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

// Check if a slot is available
export const checkSlotAvailability = async (req, res) => {
  try {
    const { bunkId, slotTime } = req.body;

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

// Get available slots for a specific bunk and date
export const getAvailableSlots = async (req, res) => {
  try {
    const { bunkId, date } = req.params;

    const bunk = await EvBunk.findById(bunkId); // Corrected
    if (!bunk) {
      return res.status(404).json({ success: false, message: "Bunk not found" });
    }

    const bookings = await Booking.find({
      bunkId,
      status: 'booked',
      slotTime: {
        $regex: `^${date}` // Match slotTime starting with the given date
      }
    });

    const startHour = 6;
    const endHour = 22;
    const slotDuration = 30;

    const allSlots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const start = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const endMin = minute + slotDuration;
        const endHourFormatted = endMin >= 60 ? (hour + 1).toString().padStart(2, '0') : hour.toString().padStart(2, '0');
        const endMinFormatted = endMin % 60 === 0 ? '00' : (endMin % 60).toString().padStart(2, '0');
        const end = `${endHourFormatted}:${endMinFormatted}`;

        const slotTime = `${date} ${start}-${end}`;
        allSlots.push(slotTime);
      }
    }

    const bookedSlotTimes = bookings.map(b => b.slotTime);
    const availableSlots = allSlots.filter(slot => !bookedSlotTimes.includes(slot));

    res.status(200).json({ success: true, availableSlots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
