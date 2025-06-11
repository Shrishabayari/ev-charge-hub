import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import dotenv from 'dotenv';
import adminRoutes from './routes/adminRoutes.js';
import bunkRoutes from './routes/bunkRouts.js';
import bookingRoutes from './routes/bookingRoutes.js';
import userRoutes from './routes/userRoutes.js'
import { WebSocketServer } from 'ws';
import http from 'http';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000', // for development
    'https://https://ev-charge-hubs1.onrender.com', // replace with actual client URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));app.use(express.json());

connectDB();

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/admin/ev-bunks', bunkRoutes); // Admin routes for EV bunks
app.use('/api/bunks', bunkRoutes); // General routes for EV bunks
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes); // ✅ added

// Create HTTP server manually
const server = http.createServer(app);

// WebSocket Server
const wss = new WebSocketServer({ server, path: '/ws' });

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