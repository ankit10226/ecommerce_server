const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      res.status(403).json({ message: 'No Token Provided!' });
    }
    const token = header.split(' ')[1];
    if (!token) {
      res.status(403).json({ message: 'Invalid Token Format!' });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decodedToken.userId, email: decodedToken.email };
    next();
  } catch (error) {
    response.status(401).json({
      message: 'Invalid or expired token',
    });
  }
};
