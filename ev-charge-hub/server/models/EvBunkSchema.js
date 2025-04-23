import mongoose from "mongoose";

const EvBunkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: { type: String },
  // Add other relevant details like operating hours, connector types, etc.
}, { timestamps: true });

const EvBunk = mongoose.model('EvBunk', EvBunkSchema);
export default EvBunk;