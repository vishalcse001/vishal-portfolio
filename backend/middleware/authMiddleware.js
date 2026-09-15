const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Request ke header se token nikalna
  const token = req.header('Authorization');

  // Agar token nahi hai toh entry block kar do
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied! (Access Denied)' });
  }

  try {
    // Token check karna ki asli hai ya nakli (Bearer hata kar sirf token read karna)
    const actualToken = token.split(" ")[1]; 
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    
    // Asli nikla toh aage jaane do
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is invalid or expired!' });
  }
};

module.exports = authMiddleware;