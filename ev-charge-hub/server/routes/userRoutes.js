const express = require("express");
const router = express.Router();
import {
    registerUser,
    loginUser,
    updateUserProfile,
  } from '../controllers/userController.js';
  import { protect } from '../middleware/authMiddleware.js';
  
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put('/profile', protect, updateUserProfile); // secure route

module.exports = router;
