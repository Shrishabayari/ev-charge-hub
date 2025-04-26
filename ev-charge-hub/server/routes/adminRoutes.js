import express from 'express';
import { addEvBunk } from '../controllers/bunkController.js';
import { registerAdmin, loginAdmin } from '../controllers/adminController.js';

const router = express.Router();

// Register and Login routes for Admin
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Get all EV Bunks (protected route)
router.get('/ev-bunks', addEvBunk);

// Add a new EV Bunk (protected route)
router.post('/ev-bunks/add', addEvBunk);

export default router;