const express = require('express');
const router = express.Router();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const logger = require('../logger/logger');
const authenticateToken = require('../middlewares/authenticateToken')
const imageUpload = require('../middlewares/imageUpload')


router.post('/infer', authenticateToken, imageUpload, async (req, res) => {
    try {
      const formData = new FormData();
      formData.append('image_file', fs.createReadStream(req.file.path));
  
      const response = await axios.post('http://internal-load-balancer:1000/infer', formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });
  
      fs.unlinkSync(req.file.path);
  
      res.send(response.data);
    } catch (error) {
      logger.error(`Error processing request: ${error.message}`);
      res.status(500).send('An internal error occurred');
    }
});

module.exports = router