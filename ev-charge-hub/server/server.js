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

// Production-ready CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] // Replace with your actual frontend URL
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3001'],
  credentials: true
}));

app.use(express.json());

// Connect to MongoDB
connectDB();

// Health check route (important for deployment)
app.get('/', (req, res) => {
  res.json({ 
    message: 'EV Charge Hub API is running!', 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/admin', adminRoutes);
app.use('/api/admin/ev-bunks', bunkRoutes);
app.use('/api/bunks', bunkRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

// Create HTTP server
const server = http.createServer(app);

// WebSocket Server with production configuration
const wss = new WebSocketServer({ 
  server, 
  path: '/ws',
  perMessageDeflate: false,
  maxPayload: 16 * 1024 // 16KB max payload
});

wss.on('connection', (ws) => {
  console.log('WebSocket Client Connected');
  
  ws.on('message', (message) => {
    console.log('Received:', message);
    ws.send('Message received!');
  });
  
  ws.on('close', () => {
    console.log('WebSocket Client Disconnected');
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Start Server with proper host binding for production
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
  });
});