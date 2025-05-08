// models/Booking.js
import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bunkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bunk',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for efficient querying
BookingSchema.index({ userId: 1, startTime: -1 });
BookingSchema.index({ bunkId: 1, startTime: 1, endTime: 1 });
BookingSchema.index({ status: 1 });

const Booking = mongoose.model('Booking', BookingSchema);

export default Booking;