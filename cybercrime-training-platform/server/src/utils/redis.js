/**
 * Redis utility for caching
 */
const { createClient } = require('redis');
const config = require('../config');

// Create Redis client
let redisClient;

/**
 * Initialize Redis client
 * @returns {Promise} Redis client connection promise
 */
const initRedis = async () => {
  if (!config.redis.enabled) {
    console.log('Redis is disabled. Skipping connection.');
    return null;
  }

  try {
    redisClient = createClient({
      url: `redis://${config.redis.password ? `:${config.redis.password}@` : ''}${config.redis.host}:${config.redis.port}`,
    });

    redisClient.on('error', (err) => {
      console.error('Redis error:', err);
    });

    await redisClient.connect();
    console.log('Redis connected');
    return redisClient;
  } catch (error) {
    console.error(`Error connecting to Redis: ${error.message}`);
    return null;
  }
};

/**
 * Get value from Redis cache
 * @param {string} key - Cache key
 * @returns {Promise<any>} Cached value or null
 */
const getCache = async (key) => {
  if (!redisClient || !config.redis.enabled) return null;

  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Redis get error: ${error.message}`);
    return null;
  }
};

/**
 * Set value in Redis cache
 * @param {string} key - Cache key
 * @param {any} value - Value to cache
 * @param {number} expireTime - Expiration time in seconds
 * @returns {Promise<boolean>} Success status
 */
const setCache = async (key, value, expireTime = 3600) => {
  if (!redisClient || !config.redis.enabled) return false;

  try {
    await redisClient.set(key, JSON.stringify(value), {
      EX: expireTime,
    });
    return true;
  } catch (error) {
    console.error(`Redis set error: ${error.message}`);
    return false;
  }
};

/**
 * Delete value from Redis cache
 * @param {string} key - Cache key
 * @returns {Promise<boolean>} Success status
 */
const deleteCache = async (key) => {
  if (!redisClient || !config.redis.enabled) return false;

  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error(`Redis delete error: ${error.message}`);
    return false;
  }
};

/**
 * Clear all values from Redis cache
 * @returns {Promise<boolean>} Success status
 */
const clearCache = async () => {
  if (!redisClient || !config.redis.enabled) return false;

  try {
    await redisClient.flushAll();
    return true;
  } catch (error) {
    console.error(`Redis clear error: ${error.message}`);
    return false;
  }
};

/**
 * Close Redis connection
 * @returns {Promise<void>}
 */
const closeRedis = async () => {
  if (!redisClient || !config.redis.enabled) return;

  try {
    await redisClient.quit();
    console.log('Redis connection closed');
  } catch (error) {
    console.error(`Error closing Redis connection: ${error.message}`);
  }
};

module.exports = {
  initRedis,
  getCache,
  setCache,
  deleteCache,
  clearCache,
  closeRedis,
};