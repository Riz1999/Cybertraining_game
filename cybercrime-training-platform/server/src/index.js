const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

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
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
}));

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

// API routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/modules', require('./routes/module.routes'));
app.use('/api/progress', require('./routes/progress.routes'));
app.use('/api/badges', require('./routes/badge.routes'));

// Import error middleware
const { errorHandler, notFound } = require('./middleware/error.middleware');

// Error handling middleware
app.use(notFound);
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
    
    // Start Express server
    app.listen(config.server.port, () => {
      logger.info(`Server running in ${config.server.env} mode on port ${config.server.port}`);
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