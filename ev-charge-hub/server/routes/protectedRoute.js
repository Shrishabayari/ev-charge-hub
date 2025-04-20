// backend/routes/protectedRoute.js
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js"; // Import the auth middleware

const router = express.Router();

// This route requires a valid JWT token
router.get("/protected", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Protected route accessed" });
});

export default router;
