import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Admin from '../models/Admin.js';

// General authentication middleware
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
      
      // Add user info to request for controllers to use
      req.user = {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin || false
      };
      
      console.log('Auth middleware - User authenticated:', {
        id: req.user.id,
        email: req.user.email,
        isAdmin: req.user.isAdmin,
        route: req.path
      });
      
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

// Protect routes - General user authentication
export const protect = asyncHandler(async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from the token
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }
      
      // Check if user is active
      if (req.user.status === 'banned' || !req.user.isActive || req.user.deletedAt) {
        res.status(403);
        throw new Error('Account is inactive, suspended, or banned');
      }
      
      next();
    } catch (error) {
      console.error('Auth Error:', error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }
  
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Protect admin routes - Admin authentication
export const protectAdmin = asyncHandler(async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if this is an admin token
      if (decoded.email) {
        // This is likely an admin token (has email field)
        req.admin = await Admin.findById(decoded.id).select('-password');
        
        if (!req.admin) {
          res.status(401);
          throw new Error('Not authorized, admin not found');
        }
      } else {
        // Check if this is a user with admin role
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user || user.role !== 'admin') {
          res.status(403);
          throw new Error('Not authorized as admin');
        }
        
        req.admin = user; // Set as admin for consistency
      }
      
      next();
    } catch (error) {
      console.error('Admin Auth Error:', error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }
  
  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Alternative: If you want to check admin role from User model
export const requireAdmin = asyncHandler(async (req, res, next) => {
  // This middleware should be used after protect middleware
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Admin access required');
  }
});

// Default export (the main middleware)
export default authMiddleware;