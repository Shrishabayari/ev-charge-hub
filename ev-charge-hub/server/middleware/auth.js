import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  console.log("🔑 Auth check for:", req.originalUrl); // Debugging log
  const authHeader = req.header("Authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  
  const token = authHeader.split(" ")[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Support both token structures
    req.user = decoded.user || decoded;
    
    // Log successful token verification
    console.log(`✅ Token verified for ${req.originalUrl}`);
    
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.log("JWT error: Token expired");
      return res.status(401).json({ 
        msg: "Token has expired, please log in again",
        expired: true 
      });
    } else {
      console.error("JWT error:", err.message);
      return res.status(401).json({ msg: "Token is not valid" });
    }
  }
};
export default authMiddleware;