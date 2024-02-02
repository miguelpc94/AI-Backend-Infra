const express = require('express');
const router = express.Router();

const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');


// This could be provided by some sort of secret manager service
const JWT_SECRET = process.env.JWT_SECRET;


// Route to generate a new JWT for an anonymous user
router.get('/generate', (req, res) => {
    const userId = uuidv4();
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
  
    res.json({ userId, token });
});

module.exports = router