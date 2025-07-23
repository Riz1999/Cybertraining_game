/**
 * Centralized configuration
 */
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development',
    isDev: (process.env.NODE_ENV || 'development') === 'development',
    isProd: process.env.NODE_ENV === 'production',
  },

  // MongoDB configuration
  db: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/cybercrime-training',
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  // Redis configuration
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || '',
    enabled: process.env.REDIS_ENABLED === 'true',
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },

  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },
};

module.exports = config;