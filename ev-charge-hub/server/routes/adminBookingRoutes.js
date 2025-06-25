// routes/adminBookingRoutes.js
import express from 'express';
import { protectAdmin } from '../middleware/protectAdmin.js';
import {
    getAllBookingsForAdmin,
    getBookingStats,
    updateBookingStatus,
    getBookingDetails
} from '../controllers/bookingController.js'; // Re-use existing booking controllers

const router = express.Router();

/**
 * @swagger
 * tags:
 * name: Admin Booking Management
 * description: API for administrators to manage EV charging bookings
 */

/**
 * @swagger
 * /api/admin/bookings:
 * get:
 * summary: Get all EV charging bookings (Admin only)
 * tags: [Admin Booking Management]
 * security:
 * - BearerAuth: []
 * parameters:
 * - in: query
 * name: status
 * schema:
 * type: string
 * enum: [active, cancelled, completed]
 * description: Filter bookings by status.
 * - in: query
 * name: startDate
 * schema:
 * type: string
 * format: date
 * description: Filter bookings starting from this date (YYYY-MM-DD).
 * - in: query
 * name: endDate
 * schema:
 * type: string
 * format: date
 * description: Filter bookings ending by this date (YYYY-MM-DD).
 * - in: query
 * name: search
 * schema:
 * type: string
 * description: Search by user name, email, bunk name, or booking ID.
 * - in: query
 * name: page
 * schema:
 * type: integer
 * default: 1
 * description: Page number for pagination.
 * - in: query
 * name: limit
 * schema:
 * type: integer
 * default: 10
 * description: Number of items per page.
 * responses:
 * 200:
 * description: Successfully retrieved all bookings.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * success:
 * type: boolean
 * example: true
 * data:
 * type: object
 * properties:
 * bookings:
 * type: array
 * items:
 * $ref: '#/components/schemas/Booking' # Assuming a Booking schema exists
 * pagination:
 * type: object
 * properties:
 * total: { type: integer }
 * page: { type: integer }
 * pages: { type: integer }
 * limit: { type: integer }
 * 401:
 * $ref: '#/components/responses/UnauthorizedError'
 * 403:
 * $ref: '#/components/responses/ForbiddenError'
 * 500:
 * $ref: '#/components/responses/InternalServerError'
 */
router.get('/', protectAdmin, getAllBookingsForAdmin); // GET all admin bookings (no '/bookings' prefix needed here)

/**
 * @swagger
 * /api/admin/bookings/stats:
 * get:
 * summary: Get booking statistics (Admin only)
 * tags: [Admin Booking Management]
 * security:
 * - BearerAuth: []
 * parameters:
 * - in: query
 * name: timeframe
 * schema:
 * type: string
 * enum: [daily, weekly, monthly, yearly]
 * default: daily
 * description: Timeframe for statistics.
 * responses:
 * 200:
 * description: Successfully retrieved booking statistics.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * success: { type: boolean, example: true }
 * data:
 * type: object
 * properties:
 * totalBookings: { type: integer }
 * activeBookings: { type: integer }
 * completedBookings: { type: integer }
 * cancelledBookings: { type: integer }
 * # Add more stats as needed
 * 401:
 * $ref: '#/components/responses/UnauthorizedError'
 * 403:
 * $ref: '#/components/responses/ForbiddenError'
 * 500:
 * $ref: '#/components/responses/InternalServerError'
 */
router.get('/stats', protectAdmin, getBookingStats);

/**
 * @swagger
 * /api/admin/bookings/{id}:
 * get:
 * summary: Get specific booking details by ID (Admin only)
 * tags: [Admin Booking Management]
 * security:
 * - BearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * pattern: '^[0-9a-fA-F]{24}$'
 * description: The ID of the booking to retrieve.
 * responses:
 * 200:
 * description: Successfully retrieved booking details.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * success: { type: boolean, example: true }
 * data:
 * $ref: '#/components/schemas/Booking'
 * 401:
 * $ref: '#/components/responses/UnauthorizedError'
 * 403:
 * $ref: '#/components/responses/ForbiddenError'
 * 404:
 * description: Booking not found.
 * 500:
 * $ref: '#/components/responses/InternalServerError'
 */
router.get('/:id', protectAdmin, getBookingDetails);

/**
 * @swagger
 * /api/admin/bookings/{id}/status:
 * patch:
 * summary: Update booking status (Admin only)
 * tags: [Admin Booking Management]
 * security:
 * - BearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * pattern: '^[0-9a-fA-F]{24}$'
 * description: The ID of the booking to update.
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - status
 * properties:
 * status:
 * type: string
 * enum: [active, cancelled, completed]
 * description: The new status of the booking.
 * responses:
 * 200:
 * description: Booking status updated successfully.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * success: { type: boolean, example: true }
 * message: { type: string, example: 'Booking status updated successfully.' }
 * data:
 * $ref: '#/components/schemas/Booking'
 * 400:
 * description: Invalid status provided.
 * 401:
 * $ref: '#/components/responses/UnauthorizedError'
 * 403:
 * $ref: '#/components/responses/ForbiddenError'
 * 404:
 * description: Booking not found.
 * 500:
 * $ref: '#/components/responses/InternalServerError'
 */
router.patch('/:id/status', protectAdmin, updateBookingStatus);

export default router;
