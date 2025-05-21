// auth.js - Make sure your middleware is working properly
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // Adjust path as needed

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token, authorization denied' 
      });
    }
    
    // Extract token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token, authorization denied' 
      });
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Add user from payload to request
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'User not found' 
        });
      }
      
      // Check if admin for certain routes
      if (req.path === '/bookings' && !user.isAdmin) {
        return res.status(403).json({ 
          success: false, 
          message: 'Access denied: Admin privileges required' 
        });
      }
      
      // Add user to request
      req.user = user;
      next();
    } catch (err) {
      console.error('JWT verification error:', err);
      res.status(401).json({ 
        success: false, 
        message: 'Token is not valid' 
      });
    }
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error' 
    });
  }
};

export default authMiddleware;