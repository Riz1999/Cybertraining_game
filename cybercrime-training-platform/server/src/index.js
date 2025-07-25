const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const fs = require('fs');

// Import configuration and utilities
const config = require('./config');
const { connectDB } = require('./config/db');
const { initRedis } = require('./utils/redis');
const logger = require('./utils/logger');
const badgeService = require('./services/badge.service');

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: config.server.env === 'production'
    ? process.env.FRONTEND_URL || true
    : '*',
  credentials: true,
};
app.use(cors(corsOptions));

// Request parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan(config.server.isDev ? 'dev' : 'combined'));

// API health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.server.env,
  });
});

// Test endpoint with no authentication
app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is working correctly',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/modules', require('./routes/module.routes'));
app.use('/api/progress', require('./routes/progress.routes'));
app.use('/api/badges', require('./routes/badge.routes'));

// Serve static files from React build
const buildPath = path.join(__dirname, '../../client/build');
console.log('Looking for build files at:', buildPath);

// Check if build directory exists
const fs = require('fs');
if (fs.existsSync(buildPath)) {
  console.log('Build directory found, serving static files');
  app.use(express.static(buildPath));

  // Handle React routing - send all non-API requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  console.log('Build directory not found at:', buildPath);
  // Fallback route for when build doesn't exist
  app.get('/', (req, res) => {
    res.json({
      message: 'Server is running but React build not found',
      buildPath: buildPath,
      environment: config.server.env
    });
  });
}

// Import error middleware
const { errorHandler, notFound } = require('./middleware/error.middleware');

// Error handling middleware
if (config.server.env !== 'production') {
  // In development, use notFound for all routes
  app.use(notFound);
}
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Initialize Redis if enabled
    await initRedis();

    // Initialize badges in database
    await badgeService.initializeBadges();
    logger.info('Badges initialized successfully');

    // Start Express server - listen on all interfaces with error handling
    const server = app.listen(config.server.port, '0.0.0.0', () => {
      logger.info(`Server running in ${config.server.env} mode on port ${config.server.port}`);
      logger.info(`Server accessible at http://localhost:${config.server.port}`);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${config.server.port} is already in use. Please use a different port.`);
      } else {
        logger.error(`Server error: ${error.message}`);
      }
      process.exit(1);
    });

    // Log all incoming requests
    app.use((req, res, next) => {
      logger.info(`${req.method} ${req.url}`);
      next();
    });

    // Add a special test route that doesn't require database access
    app.get('/test', (req, res) => {
      res.status(200).send('Server is running correctly');
    });

  } catch (error) {
    logger.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`, { stack: err.stack });
  // Close server & exit process
  process.exit(1);
});

// Start the server
startServer();