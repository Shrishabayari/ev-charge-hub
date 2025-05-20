
// routes/refreshTokenRoute.js
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
    
    // Check if token is too old (e.g., more than 30 days)
    const tokenIssuedAt = decoded.iat;
    const currentTime = Math.floor(Date.now() / 1000);
    const MAX_TOKEN_AGE = 30 * 24 * 60 * 60; // 30 days in seconds
    
    if (currentTime - tokenIssuedAt > MAX_TOKEN_AGE) {
      return res.status(401).json({ msg: "Token too old for refresh, please login again" });
    }
    
    // Determine token structure (user or admin)
    let payload;
    if (decoded.user) {
      // User token structure
      payload = { user: decoded.user };
    } else if (decoded.admin) {
      // Admin token structure
      payload = { admin: decoded.admin };
    } else {
      // Unknown token structure
      return res.status(401).json({ msg: "Invalid token structure" });
    }
    
    // Create a new token with the same payload
    const newToken = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Return the new token
    return res.json({ token: newToken, expiresIn: '7d' });
  } catch (err) {
    console.error('Token refresh error:', err);
    return res.status(401).json({ msg: "Invalid token format" });
  }
});

export default router;