import express from 'express';
import jwt from 'jsonwebtoken';
import { validateTokenStructure } from '../middleware/auth.js';

const router = express.Router();

// Generic refresh token route that works for both user and admin tokens
router.post('/', validateTokenStructure, (req, res) => {
  try {
    const decoded = req.decodedToken;
    
    // Determine what type of token we're dealing with
    let payload;
    
    if (decoded.user) {
      // User token structure
      payload = { user: decoded.user };
    } else if (decoded.id && decoded.email) {
      // Admin token structure
      payload = { id: decoded.id, email: decoded.email };
    } else {
      return res.status(400).json({ 
        msg: "Unknown token structure" 
      });
    }
    
    // Generate a new token with the same payload but fresh expiration
    const newToken = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return the new token
    res.json({
      msg: "Token refreshed successfully",
      token: newToken
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({ msg: "Server error during token refresh" });
  }
});

export default router;