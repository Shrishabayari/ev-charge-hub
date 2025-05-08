// models/Bunk.js
import mongoose from 'mongoose';

const OperatingHoursSchema = new mongoose.Schema({
  open: {
    type: String,
    required: true,
    default: '09:00'
  },
  close: {
    type: String,
    required: true,
    default: '18:00'
  }
}, { _id: false });

const BunkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: false,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: true,
    default: 1
  },
  operatingHours: {
    type: OperatingHoursSchema,
    required: true,
    default: {
      open: '09:00',
      close: '18:00'
    }
  },
  amenities: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for efficient querying
BunkSchema.index({ name: 1 });
BunkSchema.index({ location: 1 });
BunkSchema.index({ isActive: 1 });

const Bunk = mongoose.model('Bunk', BunkSchema);

export default Bunk;