const jwt = require('jsonwebtoken');

// This could be provided by some sort of secret manager service
const JWT_SECRET = process.env.JWT_SECRET;

function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
  
    if (!token) return res.status(401).send('Access Token Required');
  
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(403).send('Invalid Access Token');
  
      req.user = user;
      next();
    });
}

module.exports = authenticateToken;