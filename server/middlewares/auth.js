  import jwt from "jsonwebtoken";

  const userAuth = async (req, res, next) => {
  // Get token from Authorization header (standard practice)
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      message: "Not Authorized. Login Again" 
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to req.user (standard practice)
    req.user = { id: tokenDecode.id };
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: "Not Authorized. Invalid token" 
    });
  }
};

  export default userAuth;