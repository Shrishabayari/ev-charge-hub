// routes/bookingRoutes.js
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
// Removed protectAdmin as this file is now only for user/general routes
import {
    getBookingsByBunk,
    createBooking,
    getUserBookings,
    cancelBooking,
    rescheduleBooking,
    checkSlotAvailability,
    getAvailableSlots,
    // Removed admin-specific controllers from here
} from '../controllers/bookingController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 * name: User Booking Management
 * description: API for users to manage their EV charging bookings
 */

/**
 * @swagger
 * /api/bookings/bunk/{bunkId}:
 * get:
 * summary: Get bookings for a specific bunk (public/user access)
 * tags: [User Booking Management]
 * parameters:
 * - in: path
 * name: bunkId
 * required: true
 * schema:
 * type: string
 * pattern: '^[0-9a-fA-F]{24}$'
 * description: The ID of the EV Bunk.
 * responses:
 * 200:
 * description: Successfully retrieved bunk bookings.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * success: { type: boolean, example: true }
 * data:
 * type: array
 * items:
 * $ref: '#/components/schemas/Booking'
 * 404:
 * description: Bunk not found.
 * 500:
 * $ref: '#/components/responses/InternalServerError'
 */
router.get('/bunk/:bunkId', getBookingsByBunk);

/**
 * @swagger
 * /api/bookings/check-availability:
 * post:
 * summary: Check slot availability for a booking
 * tags: [User Booking Management]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - bunkId
 * - startTime
 * - endTime
 * properties:
 * bunkId: { type: string, pattern: '^[0-9a-fA-F]{24}$' }
 * startTime: { type: string, format: date-time }
 * endTime: { type: string, format: date-time }
 * responses:
 * 200:
 * description: Availability check successful.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * success: { type: boolean, example: true }
 * available: { type: boolean }
 * message: { type: string }
 * 400:
 * description: Invalid input.
 * 500:
 * $ref: '#/components/responses/InternalServerError'
 */
router.post('/check-availability', checkSlotAvailability);

/**
 * @swagger
 * /api/bookings/available-slots/{bunkId}/{date}:
 * get:
 * summary: Get available slots for a specific bunk on a given date
 * tags: [User Booking Management]
 * parameters:
 * - in: path
 * name: bunkId
 * required: true
 * schema:
 * type: string
 * pattern: '^[0-9a-fA-F]{24}$'
 * description: The ID of the EV Bunk.
 * - in: path
 * name: date
 * required: true
 * schema:
 * type: string
 * format: date
 * example: "2024-07-20"
 * description: The date to check for available slots (YYYY-MM-DD).
 * responses:
 * 200:
 * description: Successfully retrieved available slots.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * success: { type: boolean, example: true }
 * data:
 * type: array
 * items:
 * type: object
 * properties:
 * startTime: { type: string, format: date-time }
 * endTime: { type: string, format: date-time }
 * isAvailable: { type: boolean }
 * 400:
 * description: Invalid input or date format.
 * 500:
 * $ref: '#/components/responses/InternalServerError'
 */
router.get('/available-slots/:bunkId/:date', getAvailableSlots);

/**
 * @swagger
 * /api/bookings/create:
 * post:
 * summary: Create a new EV charging booking (User authenticated)
 * tags: [User Booking Management]
 * security:
 * - BearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - bunkId
 * - startTime
 * - endTime
 * - vehicleDetails
 * properties:
 * bunkId: { type: string, pattern: '^[0-9a-fA-F]{24}$' }
 * startTime: { type: string, format: date-time }
 * endTime: { type: string, format: date-time }
 * vehicleDetails:
 * type: object
 * properties:
 * make: { type: string }
 * model: { type: string }
 * licensePlate: { type: string }
 * responses:
 * 201:
 * description: Booking created successfully.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * success: { type: boolean, example: true }
 * message: { type: string, example: 'Booking created successfully.' }
 * data:
 * $ref: '#/components/schemas/Booking'
 * 400:
 * description: Invalid booking data or slot not available.
 * 401:
 * $ref: '#/components/responses/UnauthorizedError'
 * 500:
 * $ref: '#/components/responses/InternalServerError'
 */
router.post('/create', authMiddleware, createBooking);

/**
 * @swagger
 * /api/bookings/user:
 * get:
 * summary: Get all bookings for the authenticated user
 * tags: [User Booking Management]
 * security:
 * - BearerAuth: []
 * responses:
 * 200:
 * description: Successfully retrieved user bookings.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * success: { type: boolean, example: true }
 * data:
 * type: array
 * items:
 * $ref: '#/components/schemas/Booking'
 * 401:
 * $ref: '#/components/responses/UnauthorizedError'
 * 500:
 * $ref: '#/components/responses/InternalServerError'
 */
router.get('/user', authMiddleware, getUserBookings);

/**
 * @swagger
 * /api/bookings/cancel/{id}:
 * put:
 * summary: Cancel a user's booking by ID
 * tags: [User Booking Management]
 * security:
 * - BearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * pattern: '^[0-9a-fA-F]{24}$'
 * description: The ID of the booking to cancel.
 * responses:
 * 200:
 * description: Booking cancelled successfully.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * success: { type: boolean, example: true }
 * message: { type: string, example: 'Booking cancelled successfully.' }
 * data:
 * $ref: '#/components/schemas/Booking'
 * 401:
 * $ref: '#/components/responses/UnauthorizedError'
 * 403:
 * description: Not authorized to cancel this booking.
 * 404:
 * description: Booking not found.
 * 500:
 * $ref: '#/components/responses/InternalServerError'
 */
router.put('/cancel/:id', authMiddleware, cancelBooking);

/**
 * @swagger
 * /api/bookings/reschedule/{id}:
 * put:
 * summary: Reschedule a user's booking by ID
 * tags: [User Booking Management]
 * security:
 * - BearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * pattern: '^[0-9a-fA-F]{24}$'
 * description: The ID of the booking to reschedule.
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - newStartTime
 * - newEndTime
 * properties:
 * newStartTime: { type: string, format: date-time }
 * newEndTime: { type: string, format: date-time }
 * responses:
 * 200:
 * description: Booking rescheduled successfully.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * success: { type: boolean, example: true }
 * message: { type: string, example: 'Booking rescheduled successfully.' }
 * data:
 * $ref: '#/components/schemas/Booking'
 * 400:
 * description: Invalid time slot or slot not available.
 * 401:
 * $ref: '#/components/responses/UnauthorizedError'
 * 403:
 * description: Not authorized to reschedule this booking.
 * 404:
 * description: Booking not found.
 * 500:
 * $ref: '#/components/responses/InternalServerError'
 */
router.put('/reschedule/:id', authMiddleware, rescheduleBooking);

export default router;
