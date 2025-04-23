// File: routes/adminRoutes.js
import express from "express";
import { 
  registerAdmin, 
  loginAdmin, 
  forgotPassword, 
  resetPassword 
} from "../controllers/adminController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Auth routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected route example
router.get("/profile", verifyToken, (req, res) => {
  res.status(200).json({ message: "Profile accessed successfully", user: req.user });
});

export default router;