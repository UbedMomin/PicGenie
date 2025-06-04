import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const userAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: "Not authorized, no token" 
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get full user document from DB
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Attach complete user object
    req.user = user;
    next();
  } catch (error) {
    let message = "Not authorized, token failed";
    if (error.name === 'TokenExpiredError') {
      message = "Token expired";
    } else if (error.name === 'JsonWebTokenError') {
      message = "Invalid token";
    }

    res.status(401).json({ 
      success: false, 
      message 
    });
  }
};

export default userAuth;