import express from "express";
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');
import { registerAdmin, loginAdmin } from "../controllers/adminController.js";
  
 router.post("/register", registerAdmin);
 router.post("/login", loginAdmin);
 router.get('/ev-bunks', authMiddleware, adminController.getAllEvBunks);

 export default router;