import EvBunk from "../models/EvBunk.js"; // Import the EvBunk model
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register Admin (already created)
export const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully" });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin Login
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // JWT token generation
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // token expires in 1 hour
    );

    res.status(200).json({ message: "Login successful", token });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch all EV Bunks (already created)
const getAllEvBunks = async (req, res) => {
  try {
    const evBunks = await EvBunk.find(); // Fetch all EV bunk locations
    res.json(evBunks);
  } catch (error) {
    console.error('Error fetching EV bunk locations:', error);
    res.status(500).json({ message: 'Failed to fetch EV bunk locations' });
  }
};

// Add a new EV Bunk
export const addEvBunk = async (req, res) => {
  const { name, address, phone, slotsAvailable, latitude, longitude, operatingHours, connectorTypes } = req.body;

  try {
    // Create a new EV Bunk entry
    const newEVBunk = new EvBunk({
      name,
      address,
      phone,
      slotsAvailable,
      latitude,
      longitude,
      operatingHours: operatingHours || "9:00 AM - 9:00 PM", // Default hours if not provided
      connectorTypes: connectorTypes || ["Type 2", "CCS"], // Default connectors if not provided
    });

    // Save the EV Bunk to the database
    await newEVBunk.save();

    res.status(201).json({ message: "EV Bunk added successfully", data: newEVBunk });

  } catch (error) {
    console.error("Error adding EV Bunk:", error);
    res.status(500).json({ message: "Error adding EV Bunk", error: error.message });
  }
};

module.exports = {
  getAllEvBunks,
  addEvBunk,  // Add the addEvBunk method here
  // updateEvBunk,
  // deleteEvBunk,
};
