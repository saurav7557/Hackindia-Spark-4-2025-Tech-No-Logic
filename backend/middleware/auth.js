const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  // Get token from Authorization header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // If no token, return unauthorized error
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach decoded user info to request
    req.user = decoded;
    
    // Continue execution
    next();
  } catch (error) {
    res.status(400).send('Invalid token');
  }
};

module.exports = auth;
