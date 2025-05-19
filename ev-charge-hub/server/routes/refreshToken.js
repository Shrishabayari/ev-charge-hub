// routes/refreshTokenRoute.js - Create a new refresh token endpoint
import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Refresh token endpoint
router.post('/', (req, res) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(400).json({ msg: "Token is required" });
  }
  
  try {
    // Verify the token structure but ignore expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
    
    // Determine token structure (user or admin)
    let payload;
    if (decoded.user) {
      // User token structure
      payload = { user: decoded.user };
    } else {
      // Admin token or other structure
      payload = decoded;
    }
    
    // Create a new token with the same payload
    const newToken = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return the new token
    return res.json({ token: newToken });
  } catch (err) {
    console.error('Token refresh error:', err);
    return res.status(401).json({ msg: "Invalid token format" });
  }
});

export default router;