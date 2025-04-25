import mongoose from "mongoose";

// Define the EV Bunk Schema
const EvBunkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: { type: String, required: true },
  phone: { 
    type: String, 
    required: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'] // Adding regex for phone validation
  },
  slotsAvailable: { type: Number, required: true },  // Number of available recharge slots
  operatingHours: { 
    type: String, 
    required: true, 
    default: "9:00 AM - 9:00 PM"  // Example default operating hours
  },
  connectorTypes: { 
    type: [String], 
    required: true, 
    default: ["Type 2", "CCS"]  // Example default connector types
  },
}, { timestamps: true });

const EvBunk = mongoose.model('EvBunk', EvBunkSchema);
export default EvBunk;
