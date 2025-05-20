// auth/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

// Authentication middleware function
const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('x-auth-token');
  
  // Check if no token
  if (!token) {
    return res.status(401).json({ 
      msg: 'No authentication token, authorization denied',
      isExpired: false,
      requiresLogin: true
    });
  }
  
  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user || decoded.admin;
    req.isAdmin = !!decoded.admin;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        msg: 'Token has expired, please refresh or login again',
        isExpired: true,
        requiresRefresh: true
      });
    } else {
      return res.status(401).json({ 
        msg: 'Token is not valid',
        isExpired: false,
        requiresLogin: true,
        error: err.message
      });
    }
  }
};

export default auth;