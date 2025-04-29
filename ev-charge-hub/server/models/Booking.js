import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bunkId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bunk', required: true },
  slotTime: { type: String, required: true }, // or use Date for more precision
  status: { type: String, enum: ['booked', 'cancelled', 'rescheduled'], default: 'booked' },
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
