// models/EvBunkSchema.js
import mongoose from 'mongoose';

const evBunkSchema = new mongoose.Schema({
  bunkId: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  slotsAvailable: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  operatingHours: {
    type: String,
    required: true,
  },
  connectorTypes: {
    type: [String],  // Array of strings
    required: true,
  },
});

const EvBunk = mongoose.model('EvBunk', evBunkSchema);

export default EvBunk;
