import express from 'express';
import { addEvBunk } from '../controllers/bunkController.js';

const router = express.Router();

// GET all EV bunks
router.get('/', (req, res) => {
  // Temporary implementation
  res.json({ message: "GET all EV bunks endpoint" });
});

// POST new EV bunk
router.post('/add', (req, res) => {
  // Temporary implementation
  res.json({ message: "Add new EV bunk endpoint", data: req.body });
});

export default router;