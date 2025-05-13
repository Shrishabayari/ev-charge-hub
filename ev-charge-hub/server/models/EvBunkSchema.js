import mongoose from 'mongoose';

const evBunkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {  // Instead of location, used in code
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
  operatingHours: {  // String format like "09:00-18:00"
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