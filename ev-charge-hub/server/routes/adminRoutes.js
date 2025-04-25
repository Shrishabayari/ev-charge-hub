import express from 'express';
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
import { registerAdmin, loginAdmin } from '../controllers/adminController.js';

// Register and Login routes for Admin
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Get all EV Bunks (protected route)
router.get('/ev-bunks', authMiddleware, adminController.getAllEvBunks);

// Add a new EV Bunk (protected route)
router.post('/ev-bunks/add', authMiddleware, adminController.addEvBunk);

export default router;
