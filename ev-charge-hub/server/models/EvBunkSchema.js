const mongoose = require('mongoose');

const bunkSchema = new mongoose.Schema({
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

const Bunk = mongoose.model('Bunk', bunkSchema);

module.exports = Bunk;
