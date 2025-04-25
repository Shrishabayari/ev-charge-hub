import mongoose from "mongoose";

// Define the EV Bunk Schema
const EvBunkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },  // Phone number of the EV Bunk
  slotsAvailable: { type: Number, required: true },  // Number of available recharge slots
  // Add other relevant details like operating hours, connector types, etc.
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
