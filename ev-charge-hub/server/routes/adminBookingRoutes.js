// routes/adminBookingRoutes.js
import express from 'express';
import { protectAdmin } from '../middleware/authMiddleware.js'; // Double-check this path
import { getAllBookingsForAdmin } from '../controllers/bookingController.js'; // Double-check this path

const router = express.Router();

// This defines the GET /api/admin/bookings route
router.get('/', protectAdmin, getAllBookingsForAdmin);

export default router;