/**
 * Token service for handling JWT tokens
 */
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const moment = require('moment');
const config = require('../config');
const Token = require('../models/Token');
const { getCache, setCache } = require('../utils/redis');

/**
 * Generate JWT token
 * @param {Object} user - User object
 * @param {string} [type='access'] - Token type (access or refresh)
 * @param {Date} [expires] - Expiration date
 * @returns {string} JWT token
 */
const generateToken = (user, type = 'access', expires) => {
  const payload = {
    sub: user.id,
    role: user.role,
    type,
    iat: moment().unix(),
  };

  const expiresIn = type === 'access' 
    ? config.jwt.expiresIn 
    : config.jwt.refreshExpiresIn || '30d';

  return jwt.sign(payload, config.jwt.secret, { expiresIn });
};

/**
 * Save refresh token to database
 * @param {string} token - Refresh token
 * @param {string} userId - User ID
 * @param {Date} expires - Expiration date
 * @param {string} type - Token type
 * @param {boolean} blacklisted - Whether the token is blacklisted
 * @returns {Promise<Token>} Saved token document
 */
const saveToken = async (token, userId, expires, type = 'refresh', blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    userId,
    expires,
    type,
    blacklisted,
  });

  return tokenDoc;
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

/**
 * Generate auth tokens (access and refresh)
 * @param {Object} user - User object
 * @returns {Object} Access and refresh tokens
 */
const generateAuthTokens = async (user) => {
  // Generate access token
  const accessToken = generateToken(user, 'access');
  
  // Generate refresh token
  const refreshToken = generateToken(user, 'refresh');
  
  // Calculate refresh token expiry
  const refreshTokenExpires = moment().add(
    config.jwt.refreshExpiresInDays || 30, 
    'days'
  ).toDate();
  
  // Save refresh token to database
  await saveToken(refreshToken, user.id, refreshTokenExpires);
  
  return {
    access: {
      token: accessToken,
      expires: moment().add(
        config.jwt.expiresInMinutes || 30, 
        'minutes'
      ).toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires,
    },
  };
};

/**
 * Find token in database
 * @param {string} token - Token string
 * @param {string} type - Token type
 * @param {boolean} includeBlacklisted - Whether to include blacklisted tokens
 * @returns {Promise<Token>} Token document
 */
const findToken = async (token, type, includeBlacklisted = false) => {
  const query = {
    token,
    type,
  };
  
  if (!includeBlacklisted) {
    query.blacklisted = false;
  }
  
  return Token.findOne(query);
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken - Refresh token
 * @returns {Promise<Object>} New access and refresh tokens
 */
const refreshAuthTokens = async (refreshToken) => {
  try {
    // Verify refresh token
    const payload = verifyToken(refreshToken);
    
    // Check if token exists in database
    const tokenDoc = await findToken(refreshToken, 'refresh');
    if (!tokenDoc) {
      throw new Error('Refresh token not found');
    }
    
    // Get user
    const user = { id: payload.sub, role: payload.role };
    
    // Blacklist current refresh token
    await Token.findOneAndUpdate(
      { token: refreshToken },
      { blacklisted: true }
    );
    
    // Generate new tokens
    return generateAuthTokens(user);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

/**
 * Blacklist token
 * @param {string} token - Token to blacklist
 * @returns {Promise<boolean>} Success status
 */
const blacklistToken = async (token) => {
  try {
    // Verify token
    const payload = verifyToken(token);
    
    // Check if token is refresh token
    if (payload.type === 'refresh') {
      // Find and update token in database
      await Token.findOneAndUpdate(
        { token },
        { blacklisted: true }
      );
    } else {
      // For access tokens, add to Redis blacklist
      const tokenKey = `blacklist:${token}`;
      const expirySeconds = payload.exp - moment().unix();
      
      if (expirySeconds > 0) {
        await setCache(tokenKey, 'blacklisted', expirySeconds);
      }
    }
    
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Check if token is blacklisted
 * @param {string} token - Token to check
 * @returns {Promise<boolean>} Whether token is blacklisted
 */
const isTokenBlacklisted = async (token) => {
  try {
    // Verify token
    const payload = verifyToken(token);
    
    // Check if token is refresh token
    if (payload.type === 'refresh') {
      // Check database
      const tokenDoc = await Token.findOne({ token, blacklisted: true });
      return !!tokenDoc;
    } else {
      // Check Redis blacklist
      const tokenKey = `blacklist:${token}`;
      const blacklisted = await getCache(tokenKey);
      return !!blacklisted;
    }
  } catch (error) {
    return false;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  generateAuthTokens,
  refreshAuthTokens,
  blacklistToken,
  isTokenBlacklisted,
  saveToken,
  findToken,
};