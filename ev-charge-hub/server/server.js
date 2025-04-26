import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { WebSocket } from 'ws';
import http from 'http';
import dotenv from 'dotenv';
import adminRoutes from './routes/adminRoutes.js';
import bunkRoutes from './routes/bunkRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Admin Schema and Model
const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

// Use mongoose.models to prevent duplicate model compilation
const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

// Admin Register Route
app.post('/api/admin/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
    });

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

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = 'dummy-admin-token'; // Replace with real JWT generation if needed

    res.status(200).json({ message: 'Login successful', token });

  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/admin/ev-bunks', bunkRoutes);

// Create HTTP server manually
const server = http.createServer(app);

// WebSocket Server
const wss = new WebSocket.Server({ server, path: '/ws' });

wss.on('connection', (ws) => {
  console.log('WebSocket Client Connected');

  ws.on('message', (message) => {
    console.log('Received:', message);
    ws.send('Message received!');
  });

  ws.on('close', () => {
    console.log('WebSocket Client Disconnected');
  });
});

// Start Server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});