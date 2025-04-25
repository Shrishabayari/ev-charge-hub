const express = require('express');
const connectDB = require('./config/db'); // Assuming this handles MongoDB connection
const cors = require('cors');
const bcrypt = require('bcrypt'); // For password hashing
const mongoose = require('mongoose'); // To define the Admin model
const WebSocket = require('ws'); // For WebSocket server

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

// Admin Login Route
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the admin by email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' }); // Unauthorized
    }

    // Compare the provided password with the stored hashed password
    const isPasswordMatch = await bcrypt.compare(password, admin.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' }); // Unauthorized
    }

    // If credentials are valid, generate a token
    // const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const token = 'dummy-admin-token'; // Replace with actual JWT generation

    res.status(200).json({ message: 'Login successful', token });

  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// WebSocket Server Setup
const wss = new WebSocket.Server({ server: app, path: '/ws' });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    // You can handle messages from the client here and broadcast them to other clients if needed
    ws.send('Message received!'); // Send a response back to the client
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
