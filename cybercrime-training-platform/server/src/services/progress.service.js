/**
 * Progress Service
 * Handles progress tracking and XP calculations
 */
const User = require('../models/User');
const Progress = require('../models/Progress');
const Module = require('../models/Module');
const Badge = require('../models/Badge');
const logger = require('../utils/logger');

/**
 * XP levels configuration
 * Each level requires more XP than the previous one
 */
const XP_LEVELS = [
  { level: 1, xpRequired: 0 },
  { level: 2, xpRequired: 100 },
  { level: 3, xpRequired: 250 },
  { level: 4, xpRequired: 500 },
  { level: 5, xpRequired: 1000 },
  { level: 6, xpRequired: 1750 },
  { level: 7, xpRequired: 2750 },
  { level: 8, xpRequired: 4000 },
  { level: 9, xpRequired: 5500 },
  { level: 10, xpRequired: 7500 },
  { level: 11, xpRequired: 10000 },
  { level: 12, xpRequired: 13000 },
  { level: 13, xpRequired: 16500 },
  { level: 14, xpRequired: 20500 },
  { level: 15, xpRequired: 25000 },
];

/**
 * XP bonuses for different achievements
 */
const XP_BONUSES = {
  ACTIVITY_COMPLETION: 10,
  PERFECT_SCORE: 20,
  FIRST_ATTEMPT: 15,
  MODULE_COMPLETION: 50,
  BADGE_EARNED: 25,
  STREAK_BONUS: 5, // Per day of consecutive activity
  DAILY_LOGIN: 10, // Bonus for logging in daily
  WEEKLY_COMPLETION: 30, // Bonus for completing activities every week
};

/**
 * Certification requirements
 */
const CERTIFICATION_REQUIREMENTS = {
  MIN_SCORE_PERCENTAGE: 80, // Minimum score percentage required for certification
  REQUIRED_MODULES: ['module1', 'module2', 'module3', 'module4', 'module5', 'module6'], // Required modules for certification
  OPTIONAL_MODULES: ['module7'], // Optional modules
};

/**
 * Get user progress
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User progress
 */
const getUserProgress = async (userId) => {
  try {
    // Find or create progress document
    let progress = await Progress.findOne({ userId });
    
    if (!progress) {
      progress = await Progress.create({
        userId,
        modules: [],
      });
    }
    
    return progress;
  } catch (error) {
    logger.error('Error getting user progress:', { error: error.message });
    throw new Error('Error getting user progress');
  }
};

/**
 * Calculate user level based on XP
 * @param {number} totalXP - Total XP
 * @returns {number} User level
 */
const calculateLevel = (totalXP) => {
  // Find the highest level that the user's XP exceeds the requirement for
  const level = XP_LEVELS.reduce((currentLevel, levelData) => {
    if (totalXP >= levelData.xpRequired) {
      return levelData.level;
    }
    return currentLevel;
  }, 1);
  
  return level;
};

/**
 * Calculate XP for next level
 * @param {number} currentLevel - Current level
 * @returns {Object} XP required for next level and progress percentage
 */
const calculateXPForNextLevel = (currentLevel, totalXP) => {
  // Find current level data
  const currentLevelData = XP_LEVELS.find(level => level.level === currentLevel);
  
  // Find next level data
  const nextLevelData = XP_LEVELS.find(level => level.level === currentLevel + 1);
  
  // If user is at max level, return 100% progress
  if (!nextLevelData) {
    return {
      xpForNextLevel: 0,
      progress: 100,
    };
  }
  
  // Calculate XP needed for next level
  const xpForNextLevel = nextLevelData.xpRequired - totalXP;
  
  // Calculate progress percentage towards next level
  const levelXPRange = nextLevelData.xpRequired - currentLevelData.xpRequired;
  const xpInCurrentLevel = totalXP - currentLevelData.xpRequired;
  const progress = Math.round((xpInCurrentLevel / levelXPRange) * 100);
  
  return {
    xpForNextLevel,
    progress,
  };
};

/**
 * Calculate XP for activity completion
 * @param {Object} activity - Activity data
 * @param {Object} activityProgress - Activity progress data
 * @returns {number} XP earned
 */
const calculateActivityXP = (activity, activityProgress) => {
  let xp = 0;
  
  // Base XP for completing the activity
  if (activityProgress.status === 'completed') {
    xp += XP_BONUSES.ACTIVITY_COMPLETION;
    
    // Bonus for perfect score
    const maxScore = activity.points || 0;
    if (activityProgress.score === maxScore) {
      xp += XP_BONUSES.PERFECT_SCORE;
    }
    
    // Bonus for completing on first attempt
    if (activityProgress.attempts === 1) {
      xp += XP_BONUSES.FIRST_ATTEMPT;
    }
  }
  
  return xp;
};

/**
 * Update activity progress
 * @param {string} userId - User ID
 * @param {string} moduleId - Module ID
 * @param {string} activityId - Activity ID
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>} Updated progress and earned XP
 */
const updateActivityProgress = async (userId, moduleId, activityId, updateData) => {
  try {
    // Get user progress
    const progress = await getUserProgress(userId);
    
    // Get module data
    const module = await Module.findOne({ id: moduleId });
    if (!module) {
      throw new Error('Module not found');
    }
    
    // Get activity data
    const activity = module.activities.find(a => a.id === activityId);
    if (!activity) {
      throw new Error('Activity not found');
    }
    
    // Find or create module progress
    let moduleProgress = progress.modules.find(m => m.moduleId === moduleId);
    let isNewModule = false;
    
    if (!moduleProgress) {
      isNewModule = true;
      moduleProgress = {
        moduleId,
        status: 'in_progress',
        activitiesCompleted: [],
        currentScore: 0,
        attempts: 1,
        startedAt: new Date(),
        timeSpent: 0,
      };
      progress.modules.push(moduleProgress);
    }
    
    // Find or create activity progress
    let activityProgress = moduleProgress.activitiesCompleted.find(a => a.activityId === activityId);
    let isNewActivity = false;
    
    if (!activityProgress) {
      isNewActivity = true;
      activityProgress = {
        activityId,
        status: 'in_progress',
        score: 0,
        attempts: 1,
        userResponses: [],
      };
      moduleProgress.activitiesCompleted.push(activityProgress);
    } else {
      // Increment attempts if not completed
      if (activityProgress.status !== 'completed') {
        activityProgress.attempts += 1;
      }
    }
    
    // Calculate XP before updating
    const previousXP = calculateActivityXP(activity, activityProgress);
    
    // Update activity progress
    Object.assign(activityProgress, updateData);
    
    // Calculate new XP
    const newXP = calculateActivityXP(activity, activityProgress);
    
    // Calculate XP difference
    const earnedXP = newXP - previousXP;
    
    // Update module status and score
    moduleProgress.currentScore = moduleProgress.activitiesCompleted.reduce(
      (total, activity) => total + activity.score,
      0
    );
    
    // Check if all activities are completed
    const allActivitiesCompleted = module.activities.every(activity => {
      const activityProgress = moduleProgress.activitiesCompleted.find(a => a.activityId === activity.id);
      return activityProgress && activityProgress.status === 'completed';
    });
    
    let earnedBadge = null;
    
    // If all activities are completed, mark module as completed
    if (allActivitiesCompleted && moduleProgress.status !== 'completed') {
      moduleProgress.status = 'completed';
      moduleProgress.completedAt = new Date();
      
      // Add module completion bonus
      earnedXP += XP_BONUSES.MODULE_COMPLETION;
      
      // Check if badge should be awarded based on module completion
      let badgeToAward = null;
      
      // Determine badge based on module ID
      if (moduleId === 'module-1-intro-cybercrime') {
        badgeToAward = {
          id: 'cyber-awareness-starter',
          name: 'Cyber Awareness Starter',
          description: 'Completed the introduction to cybercrime investigation with excellence',
          imageUrl: '/assets/badges/cyber-awareness-starter.svg'
        };
      } else if (moduleId === 'module-2-complaint-categorization') {
        badgeToAward = {
          id: 'first-responder',
          name: 'First Responder',
          description: 'Mastered complaint categorization and intake procedures with professional excellence',
          imageUrl: '/assets/badges/first-responder.svg'
        };
      } else if (module.badgeReward) {
        // Fallback to module's badge reward if defined
        const badge = await Badge.findOne({ id: module.badgeReward.id });
        if (badge) {
          badgeToAward = {
            id: badge.id,
            name: badge.name,
            description: badge.description,
            imageUrl: badge.imageUrl
          };
        }
      }
      
      // Award badge if one is determined and user doesn't have it
      if (badgeToAward) {
        const user = await User.findById(userId);
        const hasBadge = user.badgesEarned.some(b => b.id === badgeToAward.id);
        
        if (!hasBadge) {
          // Add badge to user
          user.badgesEarned.push({
            id: badgeToAward.id,
            name: badgeToAward.name,
            description: badgeToAward.description,
            imageUrl: badgeToAward.imageUrl,
            earnedAt: new Date(),
          });
          
          // Add badge XP bonus (higher for Module 2)
          const badgeXP = badgeToAward.id === 'first-responder' ? 150 : XP_BONUSES.BADGE_EARNED;
          earnedXP += badgeXP;
          
          // Save user
          await user.save();
          
          // Set earned badge for response
          earnedBadge = badgeToAward;
        }
      }
    }
    
    // Save progress
    await progress.save();
    
    // Update user XP and level
    if (earnedXP > 0) {
      const user = await User.findById(userId);
      user.totalXP += earnedXP;
      
      // Calculate new level
      const newLevel = calculateLevel(user.totalXP);
      const leveledUp = newLevel > user.level;
      user.level = newLevel;
      
      // Save user
      await user.save();
      
      // Return XP info
      return {
        progress,
        xp: {
          earned: earnedXP,
          total: user.totalXP,
          level: user.level,
          leveledUp,
          nextLevel: calculateXPForNextLevel(user.level, user.totalXP),
        },
        badge: earnedBadge,
      };
    }
    
    return {
      progress,
      xp: {
        earned: 0,
      },
      badge: null,
    };
  } catch (error) {
    logger.error('Error updating activity progress:', { error: error.message });
    throw new Error('Error updating activity progress');
  }
};

/**
 * Get user statistics
 * @param {string} userId - User ID
 * @returns {Promise<Object>} User statistics
 */
const getUserStatistics = async (userId) => {
  try {
    // Get user
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Get user progress
    const progress = await getUserProgress(userId);
    
    // Calculate statistics
    const totalModules = await Module.countDocuments();
    const completedModules = progress.modules.filter(m => m.status === 'completed').length;
    const inProgressModules = progress.modules.filter(m => m.status === 'in_progress').length;
    
    // Calculate completion percentage
    const completionPercentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
    
    // Calculate total time spent
    const totalTimeSpent = progress.modules.reduce((total, module) => total + (module.timeSpent || 0), 0);
    
    // Calculate average score
    const moduleScores = progress.modules.filter(m => m.status === 'completed').map(m => m.currentScore);
    const averageScore = moduleScores.length > 0 ? Math.round(moduleScores.reduce((sum, score) => sum + score, 0) / moduleScores.length) : 0;
    
    // Get next level info
    const nextLevelInfo = calculateXPForNextLevel(user.level, user.totalXP);
    
    return {
      totalXP: user.totalXP,
      level: user.level,
      nextLevelProgress: nextLevelInfo.progress,
      xpForNextLevel: nextLevelInfo.xpForNextLevel,
      badgesCount: user.badgesEarned.length,
      completedModules,
      inProgressModules,
      totalModules,
      completionPercentage,
      totalTimeSpent,
      averageScore,
    };
  } catch (error) {
    logger.error('Error getting user statistics:', { error: error.message });
    throw new Error('Error getting user statistics');
  }
};

/**
 * Update time spent on module
 * @param {string} userId - User ID
 * @param {string} moduleId - Module ID
 * @param {number} timeSpent - Time spent in seconds
 * @returns {Promise<Object>} Updated progress
 */
const updateTimeSpent = async (userId, moduleId, timeSpent) => {
  try {
    // Get user progress
    const progress = await getUserProgress(userId);
    
    // Find module progress
    const moduleProgress = progress.modules.find(m => m.moduleId === moduleId);
    
    if (!moduleProgress) {
      throw new Error('Module progress not found');
    }
    
    // Update time spent
    moduleProgress.timeSpent = (moduleProgress.timeSpent || 0) + timeSpent;
    
    // Save progress
    await progress.save();
    
    return progress;
  } catch (error) {
    logger.error('Error updating time spent:', { error: error.message });
    throw new Error('Error updating time spent');
  }
};

/**
 * Update user login streak
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Updated streak info and earned XP
 */
const updateLoginStreak = async (userId) => {
  try {
    // Get user
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastLogin = user.lastLogin ? new Date(user.lastLogin) : null;
    const lastLoginDate = lastLogin ? new Date(lastLogin.getFullYear(), lastLogin.getMonth(), lastLogin.getDate()) : null;
    
    // Initialize streak data if not present
    if (!user.streakData) {
      user.streakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastLoginDate: today,
        streakUpdatedToday: true
      };
      
      // Award XP for first login
      user.totalXP += XP_BONUSES.DAILY_LOGIN;
      
      await user.save();
      
      return {
        streakData: user.streakData,
        xpEarned: XP_BONUSES.DAILY_LOGIN
      };
    }
    
    // If streak already updated today, don't update again
    if (lastLoginDate && lastLoginDate.getTime() === today.getTime() && user.streakData.streakUpdatedToday) {
      return {
        streakData: user.streakData,
        xpEarned: 0
      };
    }
    
    let xpEarned = 0;
    
    // Check if last login was yesterday
    if (lastLoginDate) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastLoginDate.getTime() === yesterday.getTime()) {
        // Consecutive login - increase streak
        user.streakData.currentStreak += 1;
        
        // Update longest streak if current streak is longer
        if (user.streakData.currentStreak > user.streakData.longestStreak) {
          user.streakData.longestStreak = user.streakData.currentStreak;
        }
        
        // Award XP for daily login + streak bonus
        xpEarned = XP_BONUSES.DAILY_LOGIN + (XP_BONUSES.STREAK_BONUS * Math.min(user.streakData.currentStreak, 7));
        user.totalXP += xpEarned;
      } else if (lastLoginDate.getTime() !== today.getTime()) {
        // Not consecutive - reset streak
        user.streakData.currentStreak = 1;
        
        // Award XP for daily login
        xpEarned = XP_BONUSES.DAILY_LOGIN;
        user.totalXP += xpEarned;
      }
    }
    
    // Update streak data
    user.streakData.lastLoginDate = today;
    user.streakData.streakUpdatedToday = true;
    user.lastLogin = now;
    
    // Update user level based on new XP
    if (xpEarned > 0) {
      user.level = calculateLevel(user.totalXP);
    }
    
    await user.save();
    
    return {
      streakData: user.streakData,
      xpEarned
    };
  } catch (error) {
    logger.error('Error updating login streak:', { error: error.message });
    throw new Error('Error updating login streak');
  }
};

/**
 * Identify user's weak areas based on performance
 * @param {string} userId - User ID
 * @returns {Promise<Array>} Array of weak areas with recommendations
 */
const identifyWeakAreas = async (userId) => {
  try {
    // Get user progress
    const progress = await getUserProgress(userId);
    
    // Get all modules
    const modules = await Module.find({});
    
    const weakAreas = [];
    
    // Check for incomplete modules
    const incompleteModules = modules.filter(module => {
      const moduleProgress = progress.modules.find(m => m.moduleId === module.id);
      return !moduleProgress || moduleProgress.status !== 'completed';
    });
    
    if (incompleteModules.length > 0) {
      weakAreas.push({
        type: 'incomplete_modules',
        severity: 'high',
        details: `You have ${incompleteModules.length} incomplete modules.`,
        modules: incompleteModules.map(m => ({ id: m.id, title: m.title })),
        recommendation: 'Complete these modules to improve your overall skills.'
      });
    }
    
    // Check for low scores in completed modules
    const lowScoreModules = progress.modules
      .filter(m => m.status === 'completed' && m.currentScore < 70)
      .map(m => {
        const moduleData = modules.find(mod => mod.id === m.moduleId);
        return {
          id: m.moduleId,
          title: moduleData ? moduleData.title : m.moduleId,
          score: m.currentScore
        };
      });
    
    if (lowScoreModules.length > 0) {
      weakAreas.push({
        type: 'low_scores',
        severity: 'medium',
        details: `You have ${lowScoreModules.length} modules with scores below 70%.`,
        modules: lowScoreModules,
        recommendation: 'Review these modules to improve your understanding.'
      });
    }
    
    // Check for high attempt counts (indicating difficulty)
    const highAttemptActivities = [];
    
    progress.modules.forEach(moduleProgress => {
      const moduleData = modules.find(m => m.id === moduleProgress.moduleId);
      
      moduleProgress.activitiesCompleted.forEach(activity => {
        if (activity.attempts > 2) {
          const activityData = moduleData?.activities.find(a => a.id === activity.activityId);
          
          highAttemptActivities.push({
            moduleId: moduleProgress.moduleId,
            moduleTitle: moduleData ? moduleData.title : moduleProgress.moduleId,
            activityId: activity.activityId,
            activityTitle: activityData ? activityData.title : activity.activityId,
            attempts: activity.attempts
          });
        }
      });
    });
    
    if (highAttemptActivities.length > 0) {
      weakAreas.push({
        type: 'high_attempts',
        severity: 'medium',
        details: `You had difficulty with ${highAttemptActivities.length} activities.`,
        activities: highAttemptActivities,
        recommendation: 'Focus on these specific activities to improve your skills.'
      });
    }
    
    // Check for time efficiency (too much time spent relative to estimated duration)
    const timeEfficiencyIssues = [];
    
    progress.modules.forEach(moduleProgress => {
      const moduleData = modules.find(m => m.id === moduleProgress.moduleId);
      
      if (moduleData && moduleProgress.timeSpent) {
        // Convert estimated duration from minutes to seconds
        const estimatedDurationSeconds = moduleData.estimatedDuration * 60;
        
        // If time spent is more than 2x the estimated duration
        if (moduleProgress.timeSpent > estimatedDurationSeconds * 2) {
          timeEfficiencyIssues.push({
            moduleId: moduleProgress.moduleId,
            moduleTitle: moduleData.title,
            estimatedDuration: moduleData.estimatedDuration,
            actualDuration: Math.round(moduleProgress.timeSpent / 60)
          });
        }
      }
    });
    
    if (timeEfficiencyIssues.length > 0) {
      weakAreas.push({
        type: 'time_efficiency',
        severity: 'low',
        details: `You spent more time than expected on ${timeEfficiencyIssues.length} modules.`,
        modules: timeEfficiencyIssues,
        recommendation: 'Work on improving your time efficiency in these areas.'
      });
    }
    
    return weakAreas;
  } catch (error) {
    logger.error('Error identifying weak areas:', { error: error.message });
    throw new Error('Error identifying weak areas');
  }
};

/**
 * Check if user is eligible for certification
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Certification eligibility status
 */
const checkCertificationEligibility = async (userId) => {
  try {
    // Get user progress
    const progress = await getUserProgress(userId);
    
    // Get all modules
    const modules = await Module.find({});
    
    // Check if required modules are completed
    const requiredModuleStatuses = CERTIFICATION_REQUIREMENTS.REQUIRED_MODULES.map(moduleId => {
      const moduleProgress = progress.modules.find(m => m.moduleId === moduleId);
      const moduleData = modules.find(m => m.id === moduleId);
      
      return {
        moduleId,
        title: moduleData ? moduleData.title : moduleId,
        completed: moduleProgress && moduleProgress.status === 'completed',
        score: moduleProgress ? moduleProgress.currentScore : 0,
        minScore: moduleData ? moduleData.minPassingScore : 80
      };
    });
    
    // Check if optional modules are completed
    const optionalModuleStatuses = CERTIFICATION_REQUIREMENTS.OPTIONAL_MODULES.map(moduleId => {
      const moduleProgress = progress.modules.find(m => m.moduleId === moduleId);
      const moduleData = modules.find(m => m.id === moduleId);
      
      return {
        moduleId,
        title: moduleData ? moduleData.title : moduleId,
        completed: moduleProgress && moduleProgress.status === 'completed',
        score: moduleProgress ? moduleProgress.currentScore : 0,
        minScore: moduleData ? moduleData.minPassingScore : 80
      };
    });
    
    // Check if all required modules are completed with minimum score
    const allRequiredCompleted = requiredModuleStatuses.every(m => 
      m.completed && m.score >= m.minScore
    );
    
    // Calculate overall score
    const completedModules = progress.modules.filter(m => m.status === 'completed');
    const totalScore = completedModules.reduce((sum, m) => sum + m.currentScore, 0);
    const averageScore = completedModules.length > 0 ? totalScore / completedModules.length : 0;
    
    // Check if overall score meets minimum requirement
    const meetsOverallScoreRequirement = averageScore >= CERTIFICATION_REQUIREMENTS.MIN_SCORE_PERCENTAGE;
    
    // Determine eligibility
    const isEligible = allRequiredCompleted && meetsOverallScoreRequirement;
    
    // Identify missing requirements
    const missingRequirements = [];
    
    if (!allRequiredCompleted) {
      const incompleteModules = requiredModuleStatuses.filter(m => !m.completed || m.score < m.minScore);
      missingRequirements.push({
        type: 'incomplete_required_modules',
        details: `${incompleteModules.length} required modules need completion or higher scores.`,
        modules: incompleteModules
      });
    }
    
    if (!meetsOverallScoreRequirement) {
      missingRequirements.push({
        type: 'overall_score',
        details: `Overall score (${Math.round(averageScore)}%) is below the required minimum (${CERTIFICATION_REQUIREMENTS.MIN_SCORE_PERCENTAGE}%).`,
        currentScore: Math.round(averageScore),
        requiredScore: CERTIFICATION_REQUIREMENTS.MIN_SCORE_PERCENTAGE
      });
    }
    
    return {
      isEligible,
      overallScore: Math.round(averageScore),
      requiredModules: requiredModuleStatuses,
      optionalModules: optionalModuleStatuses,
      missingRequirements: missingRequirements.length > 0 ? missingRequirements : null
    };
  } catch (error) {
    logger.error('Error checking certification eligibility:', { error: error.message });
    throw new Error('Error checking certification eligibility');
  }
};

module.exports = {
  getUserProgress,
  updateActivityProgress,
  getUserStatistics,
  updateTimeSpent,
  calculateLevel,
  calculateXPForNextLevel,
  updateLoginStreak,
  identifyWeakAreas,
  checkCertificationEligibility
};