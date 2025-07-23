/**
 * Badge Service
 * Handles badge creation, awarding, and management
 */
const Badge = require('../models/Badge');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Badge definitions for different modules
 */
const BADGE_DEFINITIONS = {
  'cyber-awareness-starter': {
    id: 'cyber-awareness-starter',
    name: 'Cyber Awareness Starter',
    description: 'Completed the introduction to cybercrime investigation with excellence',
    imageUrl: '/assets/badges/cyber-awareness-starter.svg',
    criteria: 'Complete Module 1: Introduction to Cybercrime Investigation with 80% or higher score',
    moduleId: 'module-1-intro-cybercrime',
    xpReward: 100
  },
  'first-responder': {
    id: 'first-responder',
    name: 'First Responder',
    description: 'Mastered complaint categorization and intake procedures with professional excellence',
    imageUrl: '/assets/badges/first-responder.svg',
    criteria: 'Complete Module 2: Complaint Categorization and Intake with 80% or higher score',
    moduleId: 'module-2-complaint-categorization',
    xpReward: 150
  },
  'digital-defender': {
    id: 'digital-defender',
    name: 'Digital Defender',
    description: 'Mastered time-critical response procedures for transaction freezing',
    imageUrl: '/assets/badges/digital-defender.svg',
    criteria: 'Complete Module 3: Time-Critical Response with 80% or higher score',
    moduleId: 'module-3-time-critical-response',
    xpReward: 200
  }
};

/**
 * Initialize badges in database
 * Creates badge records if they don't exist
 */
const initializeBadges = async () => {
  try {
    for (const badgeId in BADGE_DEFINITIONS) {
      const badgeData = BADGE_DEFINITIONS[badgeId];
      
      // Check if badge already exists
      const existingBadge = await Badge.findOne({ id: badgeId });
      
      if (!existingBadge) {
        await Badge.create(badgeData);
        logger.info(`Created badge: ${badgeData.name}`);
      }
    }
  } catch (error) {
    logger.error('Error initializing badges:', { error: error.message });
    throw new Error('Error initializing badges');
  }
};

/**
 * Get badge definition by ID
 * @param {string} badgeId - Badge ID
 * @returns {Object|null} Badge definition or null if not found
 */
const getBadgeDefinition = (badgeId) => {
  return BADGE_DEFINITIONS[badgeId] || null;
};

/**
 * Check if user is eligible for a badge
 * @param {string} userId - User ID
 * @param {string} moduleId - Module ID
 * @param {Object} moduleProgress - Module progress data
 * @returns {Promise<Object>} Eligibility result
 */
const checkBadgeEligibility = async (userId, moduleId, moduleProgress) => {
  try {
    // Get user
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Determine badge ID based on module
    let badgeId = null;
    if (moduleId === 'module-1-intro-cybercrime') {
      badgeId = 'cyber-awareness-starter';
    } else if (moduleId === 'module-2-complaint-categorization') {
      badgeId = 'first-responder';
    } else if (moduleId === 'module-3-time-critical-response') {
      badgeId = 'digital-defender';
    }
    
    if (!badgeId) {
      return {
        eligible: false,
        reason: 'No badge available for this module'
      };
    }
    
    // Check if module is completed with passing score
    if (
      moduleProgress.status !== 'completed' ||
      moduleProgress.currentScore < 80
    ) {
      return {
        eligible: false,
        reason: 'Module not completed or score below 80%'
      };
    }
    
    // Check if user already has this badge
    const alreadyHasBadge = user.badgesEarned.some(badge => badge.id === badgeId);
    if (alreadyHasBadge) {
      return {
        eligible: false,
        reason: 'User already has this badge'
      };
    }
    
    return {
      eligible: true,
      badgeId,
      badgeDefinition: getBadgeDefinition(badgeId)
    };
  } catch (error) {
    logger.error('Error checking badge eligibility:', { error: error.message });
    throw new Error('Error checking badge eligibility');
  }
};

/**
 * Award badge to user
 * @param {string} userId - User ID
 * @param {string} badgeId - Badge ID to award
 * @param {Object} context - Additional context for badge awarding
 * @returns {Promise<Object>} Award result
 */
const awardBadgeToUser = async (userId, badgeId, context = {}) => {
  try {
    // Get badge definition
    const badgeDefinition = getBadgeDefinition(badgeId);
    if (!badgeDefinition) {
      throw new Error('Badge definition not found');
    }
    
    // Get or create badge in database
    let badge = await Badge.findOne({ id: badgeId });
    if (!badge) {
      badge = await Badge.create(badgeDefinition);
    }
    
    // Get user
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Check if user already has this badge
    const alreadyHasBadge = user.badgesEarned.some(userBadge => userBadge.id === badgeId);
    if (alreadyHasBadge) {
      throw new Error('User already has this badge');
    }
    
    // Add badge to user's earned badges
    const badgeToAdd = {
      id: badge.id,
      name: badge.name,
      description: badge.description,
      imageUrl: badge.imageUrl,
      earnedAt: new Date()
    };
    
    user.badgesEarned.push(badgeToAdd);
    
    // Award XP for the badge
    const xpEarned = badgeDefinition.xpReward || 50;
    user.totalXP += xpEarned;
    
    // Calculate new level (every 500 XP = 1 level)
    const newLevel = Math.floor(user.totalXP / 500) + 1;
    const leveledUp = newLevel > user.level;
    user.level = newLevel;
    
    await user.save();
    
    logger.info(`Badge awarded: ${badge.name} to user ${userId}`);
    
    return {
      success: true,
      badge: badgeToAdd,
      xp: {
        earned: xpEarned,
        total: user.totalXP,
        level: user.level,
        leveledUp
      }
    };
  } catch (error) {
    logger.error('Error awarding badge:', { error: error.message });
    throw new Error('Error awarding badge');
  }
};

/**
 * Get all available badges
 * @returns {Promise<Array>} List of all badges
 */
const getAllBadges = async () => {
  try {
    const badges = await Badge.find().sort({ createdAt: -1 });
    return badges;
  } catch (error) {
    logger.error('Error getting all badges:', { error: error.message });
    throw new Error('Error getting all badges');
  }
};

/**
 * Get user's earned badges
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of user's earned badges
 */
const getUserBadges = async (userId) => {
  try {
    const user = await User.findById(userId).select('badgesEarned');
    if (!user) {
      throw new Error('User not found');
    }
    
    return user.badgesEarned;
  } catch (error) {
    logger.error('Error getting user badges:', { error: error.message });
    throw new Error('Error getting user badges');
  }
};

/**
 * Get badge statistics for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Badge statistics
 */
const getBadgeStatistics = async (userId) => {
  try {
    const user = await User.findById(userId).select('badgesEarned');
    if (!user) {
      throw new Error('User not found');
    }
    
    const totalBadges = Object.keys(BADGE_DEFINITIONS).length;
    const earnedBadges = user.badgesEarned.length;
    const completionPercentage = totalBadges > 0 ? Math.round((earnedBadges / totalBadges) * 100) : 0;
    
    // Group badges by category
    const badgesByCategory = {};
    user.badgesEarned.forEach(badge => {
      const definition = getBadgeDefinition(badge.id);
      const category = definition?.category || 'general';
      
      if (!badgesByCategory[category]) {
        badgesByCategory[category] = [];
      }
      badgesByCategory[category].push(badge);
    });
    
    return {
      totalAvailable: totalBadges,
      totalEarned: earnedBadges,
      completionPercentage,
      badgesByCategory,
      recentBadges: user.badgesEarned
        .sort((a, b) => new Date(b.earnedAt) - new Date(a.earnedAt))
        .slice(0, 5)
    };
  } catch (error) {
    logger.error('Error getting badge statistics:', { error: error.message });
    throw new Error('Error getting badge statistics');
  }
};

module.exports = {
  initializeBadges,
  getBadgeDefinition,
  checkBadgeEligibility,
  awardBadgeToUser,
  getAllBadges,
  getUserBadges,
  getBadgeStatistics,
  BADGE_DEFINITIONS
};