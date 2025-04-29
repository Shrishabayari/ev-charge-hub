import express from 'express';
import {
  getBookingsByBunk,
  createBooking,
  getUserBookings,
  cancelBooking,
  rescheduleBooking,
  checkSlotAvailability
} from '../controllers/bookingController.js';

const router = express.Router();

router.get('/bunk/:bunkId', getBookingsByBunk);

// Create a new booking
router.post('/create', createBooking);

// Get bookings by user
router.get('/:userId', getUserBookings);

// Cancel a booking
router.put('/cancel/:id', cancelBooking);

// Reschedule a booking
router.put('/reschedule/:id', rescheduleBooking);

// Check slot availability
router.post('/check-availability', checkSlotAvailability);

export default router;
