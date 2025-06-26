// routes/adminBookingRoutes.js
import express from 'express';
import { protectAdmin } from '../middleware/protectAdmin.js';
import {
    getAllBookings,
    getBookingStats,
    updateBookingStatus,
    getBookingDetails
} from '../controllers/bookingController.js'; // Re-use existing booking controllers

const router = express.Router();

router.get('/', protectAdmin, getAllBookings); // GET all admin bookings (no '/bookings' prefix needed here)

router.get('/stats', protectAdmin, getBookingStats);

router.get('/:id', protectAdmin, getBookingDetails);

router.patch('/:id/status', protectAdmin, updateBookingStatus);

export default router;
