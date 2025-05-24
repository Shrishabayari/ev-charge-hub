import express from 'express';
import { 
  addEvBunk, 
  getAllEvBunks, 
  getEvBunkById, 
  updateEvBunk, 
  deleteEvBunk,
  getAvailableEvBunks,
  getNearbyEvBunks,
  searchEvBunks,
  getEvBunksByConnector 
} from '../controllers/evBunkController.js';

const router = express.Router();

// IMPORTANT: Order matters! Put specific routes BEFORE parameterized routes

// Special functionality routes (MUST come before /:id)
router.get('/available', getAvailableEvBunks);
router.get('/nearby', getNearbyEvBunks);
router.get('/search', searchEvBunks);
router.get('/connector', getEvBunksByConnector);

// Basic CRUD routes
router.post('/', addEvBunk);           // POST /api/ev-bunks
router.get('/', getAllEvBunks);        // GET /api/ev-bunks
router.get('/:id', getEvBunkById);     // GET /api/ev-bunks/:id (MUST be last)
router.put('/:id', updateEvBunk);      // PUT /api/ev-bunks/:id
router.delete('/:id', deleteEvBunk);   // DELETE /api/ev-bunks/:id

export default router;