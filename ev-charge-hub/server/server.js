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

// Enhanced CORS Middleware - FIXED
app.use(cors({
  origin: [
    'http://localhost:3000', // for development
    'https://ev-charge-hubs1.onrender.com', // production
    process.env.CLIENT_URL // Add env variable support
  ].filter(Boolean), // Remove undefined values
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // ✅ Added PATCH method
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle preflight requests explicitly
app.options('*', cors());

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

connectDB();

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/admin/ev-bunks', bunkRoutes); // Admin routes for EV bunks
app.use('/api/bunks', bunkRoutes); // General routes for EV bunks
app.use('/api/bookings', bookingRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' 
  });
});

// Start Server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});