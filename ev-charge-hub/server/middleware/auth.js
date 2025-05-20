import jwt from 'jsonwebtoken';

// Admin authentication middleware
const adminMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('x-auth-token');
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({ 
        msg: 'No admin token, access denied',
        isExpired: false,
        requiresLogin: true
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if token is for admin
    if (!decoded.admin) {
      return res.status(403).json({
        msg: 'Access denied. Admin privileges required.',
        isAdmin: false
      });
    }
    
    // Set admin info in request
    req.admin = decoded.admin;
    req.isAdmin = true;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        msg: 'Admin token has expired, please refresh',
        isExpired: true,
        requiresRefresh: true
      });
    } else {
      return res.status(401).json({
        msg: 'Invalid admin token',
        isExpired: false, 
        requiresLogin: true,
        error: err.message
      });
    }
  }
};

export default adminMiddleware;