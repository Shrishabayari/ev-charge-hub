import express from 'express';
import { registerUser, loginUser, updateUserProfile } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js'; // Corrected the import to ES Module syntax

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get('/profile', authMiddleware, (req, res) => res.json(req.user)); // return user profile
router.put('/profile', authMiddleware, updateUserProfile); // protected route

export default router;