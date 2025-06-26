import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  bunkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EvBunk',
    required: [true, 'EV Bunk ID is required']
  },
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required']
  },
  // ✅ FIXED: Enhanced status enum to match frontend expectations
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  // ✅ ADDED: Additional fields that might be needed
  slotTime: {
    type: String, // e.g., "10:00 AM - 11:00 AM"
    required: false
  },
  date: {
    type: Date,
    required: false
  },
  connectorType: {
    type: String,
    required: false
  },
  estimatedCost: {
    type: Number,
    required: false
  },
  actualCost: {
    type: Number,
    required: false
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  notes: {
    type: String,
    maxlength: 500
  },
  // ✅ FIXED: Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // This automatically manages createdAt and updatedAt
});

// ✅ FIXED: Pre-save middleware to update updatedAt
BookingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// ✅ FIXED: Pre-update middleware
BookingSchema.pre(['findOneAndUpdate', 'updateOne', 'updateMany'], function() {
  this.set({ updatedAt: new Date() });
});

// ✅ ENHANCED: Better indexes for performance
BookingSchema.index({ userId: 1, startTime: -1 });
BookingSchema.index({ bunkId: 1, startTime: 1, endTime: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ createdAt: -1 });
BookingSchema.index({ date: 1, status: 1 });

// ✅ ADDED: Validation for logical consistency
BookingSchema.pre('save', function(next) {
  if (this.startTime && this.endTime && this.startTime >= this.endTime) {
    next(new Error('End time must be after start time'));
  } else {
    next();
  }
});

// ✅ ADDED: Virtual for duration calculation
BookingSchema.virtual('duration').get(function() {
  if (this.startTime && this.endTime) {
    return Math.ceil((this.endTime - this.startTime) / (1000 * 60 * 60)); // Duration in hours
  }
  return 0;
});

// ✅ ADDED: Static method to find overlapping bookings
BookingSchema.statics.findOverlapping = function(bunkId, startTime, endTime, excludeBookingId = null) {
  const query = {
    bunkId,
    status: { $in: ['pending', 'confirmed', 'active'] },
    $or: [
      {
        startTime: { $lt: endTime },
        endTime: { $gt: startTime }
      }
    ]
  };
  
  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }
  
  return this.find(query);
};

// Ensure virtual fields are serialized
BookingSchema.set('toJSON', { virtuals: true });

const Booking = mongoose.model('Booking', BookingSchema);

export default Booking;