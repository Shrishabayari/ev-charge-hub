import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      msg: "No token, authorization denied" 
    });
  }
  
  const token = authHeader.split(" ")[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user || decoded; // supports both token structures
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.log("JWT error: Token expired");
      return res.status(401).json({
        msg: "Token has expired, please log in again",
        expired: true,
        // Include a timestamp to help client decide if it should try refresh
        expiredAt: err.expiredAt
      });
    } else {
      console.error("JWT error:", err.message);
      return res.status(401).json({ 
        msg: "Token is not valid" 
      });
    }
  }
};

// Export a special version that only validates the token structure
// without enforcing expiration - useful for the refresh token endpoint
export const validateTokenStructure = (req, res, next) => {
  const { token } = req.body;
  
  if (!token) {
    return res.status(401).json({ msg: "No token provided" });
  }
  
  try {
    // Verify the token structure but ignore expiration
    const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
    req.decodedToken = decoded;
    next();
  } catch (err) {
    console.error("Token structure validation error:", err.message);
    return res.status(401).json({ msg: "Invalid token format" });
  }
};

export default authMiddleware;