import express from 'express';
import { addEvBunk, getAllEvBunks, getEvBunkById, updateEvBunk, deleteEvBunk } from '../controllers/evBunkController.js';

const router = express.Router();

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
