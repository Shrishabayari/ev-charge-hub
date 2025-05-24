import express from 'express';
import { 
  addEvBunk, 
  getAllEvBunks, 
  getEvBunkById, 
  updateEvBunk, 
  deleteEvBunk,
  getBunkLocations // New controller function
} from '../controllers/evBunkController.js';

const router = express.Router();

// Get all EV Bunk locations (for map display)
router.get('/locations', getBunkLocations);

// Add a new EV Bunk
router.post('/', addEvBunk);

// Get all EV Bunks
router.get('/', getAllEvBunks);

// Get an EV Bunk by ID
router.get('/:id', getEvBunkById);

// Update an EV Bunk
router.put('/:id', updateEvBunk);

// Delete an EV Bunk
router.delete('/:id', deleteEvBunk);

export default router;