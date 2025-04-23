const express = require('express');
const connectDB = require('./config/db'); // Assuming this handles MongoDB connection
const cors = require('cors');
const bcrypt = require('bcrypt'); // For password hashing (install with: npm install bcrypt)
const mongoose = require('mongoose'); // To define the Admin model

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Connect to MongoDB
connectDB();

// Define Admin Model (in this file for simplicity, you might have it in a separate models folder)
const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Add any other admin fields as needed
}, { timestamps: true });

const Admin = mongoose.model('Admin', AdminSchema);

// Admin Registration Route
app.post('/api/admin/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the admin with this email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new admin
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
    });

    // Save the admin to the database
    const savedAdmin = await newAdmin.save();

    res.status(201).json({ message: 'Admin registered successfully', admin: { _id: savedAdmin._id, email: savedAdmin.email } });
  } catch (error) {
    console.error('Error during admin registration:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});