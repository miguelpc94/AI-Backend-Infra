const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./logger/logger');
const tokenRoutes = require('./routes/tokenRoutes')
const classifierRoutes = require('./routes/classifierRoutes')


const app = express();
const port = 3000;


app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));


// Configure rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
      error: "Too many requests, please try again later."
    },
    statusCode: 429
});
app.use(limiter);


// Enable CORS for all routes
// Trusted origin should be configured here once the rest of the infra is defined
app.use(cors());


app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:"], // Allows images from your domain and data URIs
        objectSrc: ["'none'"], // Disables <object>, <embed>, and <applet> elements
        upgradeInsecureRequests: [], // Upgrade insecure requests (useful if you mix http and https)
      },
    },
}));


app.use('/api/token', tokenRoutes);


app.use('/api/classifier', classifierRoutes);


app.listen(port, () => {
    logger.info(`classifier-interface listening at http://localhost:${port}`)
});