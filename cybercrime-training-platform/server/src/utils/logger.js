/**
 * Logger utility
 */
const config = require('../config');

// Log levels
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

// Current log level
const currentLevel = LOG_LEVELS[config.logging.level] || LOG_LEVELS.info;

/**
 * Format log message
 * @param {string} level - Log level
 * @param {string} message - Log message
 * @param {Object} meta - Additional metadata
 * @returns {string} Formatted log message
 */
const formatLog = (level, message, meta = {}) => {
  const timestamp = new Date().toISOString();
  const metaString = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaString}`;
};

/**
 * Log error message
 * @param {string} message - Log message
 * @param {Object} meta - Additional metadata
 */
const error = (message, meta = {}) => {
  if (currentLevel >= LOG_LEVELS.error) {
    console.error(formatLog('error', message, meta));
  }
};

/**
 * Log warning message
 * @param {string} message - Log message
 * @param {Object} meta - Additional metadata
 */
const warn = (message, meta = {}) => {
  if (currentLevel >= LOG_LEVELS.warn) {
    console.warn(formatLog('warn', message, meta));
  }
};

/**
 * Log info message
 * @param {string} message - Log message
 * @param {Object} meta - Additional metadata
 */
const info = (message, meta = {}) => {
  if (currentLevel >= LOG_LEVELS.info) {
    console.info(formatLog('info', message, meta));
  }
};

/**
 * Log debug message
 * @param {string} message - Log message
 * @param {Object} meta - Additional metadata
 */
const debug = (message, meta = {}) => {
  if (currentLevel >= LOG_LEVELS.debug) {
    console.debug(formatLog('debug', message, meta));
  }
};

module.exports = {
  error,
  warn,
  info,
  debug,
};