import axios from 'axios';

/**
 * Badge Service for handling badge-related operations
 */
class BadgeService {
  constructor() {
    this.baseURL = '/api/badges';
  }

  /**
   * Get authentication headers
   * @returns {Object} Headers object with authorization
   */
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }

  /**
   * Check if user is eligible for a badge
   * @param {string} moduleId - Module ID to check badge eligibility for
   * @param {Object} moduleProgress - User's progress in the module
   * @returns {Promise<Object>} Badge eligibility result
   */
  async checkBadgeEligibility(moduleId, moduleProgress) {
    try {
      const response = await axios.post(
        `${this.baseURL}/check-eligibility`,
        { moduleId, moduleProgress },
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error checking badge eligibility:', error);
      throw error;
    }
  }

  /**
   * Award a badge to the user
   * @param {string} badgeId - Badge ID to award
   * @param {string} moduleId - Module ID that triggered the badge
   * @param {Object} context - Additional context for badge awarding
   * @returns {Promise<Object>} Badge award result
   */
  async awardBadge(badgeId, moduleId, context = {}) {
    try {
      const response = await axios.post(
        `${this.baseURL}/award`,
        { badgeId, moduleId, context },
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Error awarding badge:', error);
      throw error;
    }
  }

  /**
   * Get all available badges
   * @returns {Promise<Array>} List of all badges
   */
  async getAllBadges() {
    try {
      const response = await axios.get(this.baseURL, {
        headers: this.getAuthHeaders()
      });
      return response.data.data.badges;
    } catch (error) {
      console.error('Error fetching badges:', error);
      throw error;
    }
  }

  /**
   * Get user's earned badges
   * @returns {Promise<Array>} List of user's earned badges
   */
  async getUserBadges() {
    try {
      const response = await axios.get(`${this.baseURL}/user`, {
        headers: this.getAuthHeaders()
      });
      return response.data.data.badges;
    } catch (error) {
      console.error('Error fetching user badges:', error);
      throw error;
    }
  }

  /**
   * Get badge details by ID
   * @param {string} badgeId - Badge ID
   * @returns {Promise<Object>} Badge details
   */
  async getBadgeById(badgeId) {
    try {
      const response = await axios.get(`${this.baseURL}/${badgeId}`, {
        headers: this.getAuthHeaders()
      });
      return response.data.data.badge;
    } catch (error) {
      console.error('Error fetching badge details:', error);
      throw error;
    }
  }

  /**
   * Check Module 1 completion and award "Cyber Awareness Starter" badge
   * @param {Object} moduleProgress - Module 1 progress data
   * @returns {Promise<Object>} Badge award result or null if not eligible
   */
  async checkModule1BadgeEligibility(moduleProgress) {
    const MODULE_1_ID = 'module-1-intro-cybercrime';
    const CYBER_AWARENESS_BADGE_ID = 'cyber-awareness-starter';
    
    // Check if module is completed with passing score
    if (
      moduleProgress.status === 'completed' &&
      moduleProgress.currentScore >= 80 // Minimum 80% score
    ) {
      try {
        // Check if badge already awarded
        const userBadges = await this.getUserBadges();
        const alreadyHasBadge = userBadges.some(badge => badge.id === CYBER_AWARENESS_BADGE_ID);
        
        if (!alreadyHasBadge) {
          // Award the badge
          const badgeResult = await this.awardBadge(CYBER_AWARENESS_BADGE_ID, MODULE_1_ID, {
            score: moduleProgress.currentScore,
            timeSpent: moduleProgress.timeSpent,
            completedAt: moduleProgress.completedAt
          });
          
          return {
            eligible: true,
            badge: badgeResult.data.badge,
            isNewBadge: true
          };
        } else {
          return {
            eligible: true,
            badge: userBadges.find(badge => badge.id === CYBER_AWARENESS_BADGE_ID),
            isNewBadge: false
          };
        }
      } catch (error) {
        console.error('Error awarding Module 1 badge:', error);
        return { eligible: false, error: error.message };
      }
    }
    
    return { eligible: false, reason: 'Module not completed or score too low' };
  }

  /**
   * Check Module 2 completion and award "First Responder" badge
   * @param {Object} moduleProgress - Module 2 progress data
   * @returns {Promise<Object>} Badge award result or null if not eligible
   */
  async checkModule2BadgeEligibility(moduleProgress) {
    const MODULE_2_ID = 'module-2-complaint-categorization';
    const FIRST_RESPONDER_BADGE_ID = 'first-responder';
    
    // Check if module is completed with passing score
    if (
      moduleProgress.status === 'completed' &&
      moduleProgress.currentScore >= 80 // Minimum 80% score
    ) {
      try {
        // Check if badge already awarded
        const userBadges = await this.getUserBadges();
        const alreadyHasBadge = userBadges.some(badge => badge.id === FIRST_RESPONDER_BADGE_ID);
        
        if (!alreadyHasBadge) {
          // Award the badge
          const badgeResult = await this.awardBadge(FIRST_RESPONDER_BADGE_ID, MODULE_2_ID, {
            score: moduleProgress.currentScore,
            timeSpent: moduleProgress.timeSpent,
            completedAt: moduleProgress.completedAt
          });
          
          return {
            eligible: true,
            badge: badgeResult.data.badge,
            isNewBadge: true
          };
        } else {
          return {
            eligible: true,
            badge: userBadges.find(badge => badge.id === FIRST_RESPONDER_BADGE_ID),
            isNewBadge: false
          };
        }
      } catch (error) {
        console.error('Error awarding Module 2 badge:', error);
        return { eligible: false, error: error.message };
      }
    }
    
    return { eligible: false, reason: 'Module not completed or score too low' };
  }
  
  /**
   * Check Module 3 completion and award "Digital Defender" badge
   * @param {Object} moduleProgress - Module 3 progress data
   * @returns {Promise<Object>} Badge award result or null if not eligible
   */
  async checkModule3BadgeEligibility(moduleProgress) {
    const MODULE_3_ID = 'module-3-time-critical-response';
    const DIGITAL_DEFENDER_BADGE_ID = 'digital-defender';
    
    // Check if module is completed with passing score
    if (
      moduleProgress.status === 'completed' &&
      moduleProgress.currentScore >= 80 // Minimum 80% score
    ) {
      try {
        // Check if badge already awarded
        const userBadges = await this.getUserBadges();
        const alreadyHasBadge = userBadges.some(badge => badge.id === DIGITAL_DEFENDER_BADGE_ID);
        
        if (!alreadyHasBadge) {
          // Award the badge
          const badgeResult = await this.awardBadge(DIGITAL_DEFENDER_BADGE_ID, MODULE_3_ID, {
            score: moduleProgress.currentScore,
            timeSpent: moduleProgress.timeSpent,
            completedAt: moduleProgress.completedAt
          });
          
          return {
            eligible: true,
            badge: badgeResult.data.badge,
            isNewBadge: true
          };
        } else {
          return {
            eligible: true,
            badge: userBadges.find(badge => badge.id === DIGITAL_DEFENDER_BADGE_ID),
            isNewBadge: false
          };
        }
      } catch (error) {
        console.error('Error awarding Module 3 badge:', error);
        return { eligible: false, error: error.message };
      }
    }
    
    return { eligible: false, reason: 'Module not completed or score too low' };
  }

  /**
   * Get the "Cyber Awareness Starter" badge definition
   * @returns {Object} Badge definition
   */
  getCyberAwarenessStarterBadge() {
    return {
      id: 'cyber-awareness-starter',
      name: 'Cyber Awareness Starter',
      description: 'Completed the introduction to cybercrime investigation with excellence',
      imageUrl: '/assets/badges/cyber-awareness-starter.svg',
      criteria: 'Complete Module 1: Introduction to Cybercrime Investigation with 80% or higher score',
      moduleId: 'module-1-intro-cybercrime',
      points: 100,
      rarity: 'common',
      category: 'foundation'
    };
  }

  /**
   * Get the "First Responder" badge definition
   * @returns {Object} Badge definition
   */
  getFirstResponderBadge() {
    return {
      id: 'first-responder',
      name: 'First Responder',
      description: 'Mastered complaint categorization and intake procedures with professional excellence',
      imageUrl: '/assets/badges/first-responder.svg',
      criteria: 'Complete Module 2: Complaint Categorization and Intake with 80% or higher score',
      moduleId: 'module-2-complaint-categorization',
      points: 150,
      rarity: 'common',
      category: 'investigation'
    };
  }
  
  /**
   * Get the "Digital Defender" badge definition
   * @returns {Object} Badge definition
   */
  getDigitalDefenderBadge() {
    return {
      id: 'digital-defender',
      name: 'Digital Defender',
      description: 'Mastered time-critical response procedures for transaction freezing with exceptional speed and accuracy',
      imageUrl: '/assets/badges/digital-defender.svg',
      criteria: 'Complete Module 3: Time-Critical Response with 80% or higher score',
      moduleId: 'module-3-time-critical-response',
      points: 200,
      rarity: 'uncommon',
      category: 'investigation'
    };
  }

  /**
   * Check Module 4 completion and award "FIR Specialist" badge
   * @param {Object} moduleProgress - Module 4 progress data
   * @returns {Promise<Object>} Badge award result or null if not eligible
   */
  async checkModule4BadgeEligibility(moduleProgress) {
    const MODULE_4_ID = 'module-4-escalation-fir';
    const FIR_SPECIALIST_BADGE_ID = 'fir-specialist';
    
    // Check if module is completed with passing score
    if (
      moduleProgress.status === 'completed' &&
      moduleProgress.currentScore >= 80 // Minimum 80% score
    ) {
      try {
        // Check if badge already awarded
        const userBadges = await this.getUserBadges();
        const alreadyHasBadge = userBadges.some(badge => badge.id === FIR_SPECIALIST_BADGE_ID);
        
        if (!alreadyHasBadge) {
          // Award the badge
          const badgeResult = await this.awardBadge(FIR_SPECIALIST_BADGE_ID, MODULE_4_ID, {
            score: moduleProgress.currentScore,
            timeSpent: moduleProgress.timeSpent,
            completedAt: moduleProgress.completedAt
          });
          
          return {
            eligible: true,
            badge: badgeResult.data.badge,
            isNewBadge: true
          };
        } else {
          return {
            eligible: true,
            badge: userBadges.find(badge => badge.id === FIR_SPECIALIST_BADGE_ID),
            isNewBadge: false
          };
        }
      } catch (error) {
        console.error('Error awarding Module 4 badge:', error);
        return { eligible: false, error: error.message };
      }
    }
    
    return { eligible: false, reason: 'Module not completed or score too low' };
  }

  /**
   * Get the "FIR Specialist" badge definition
   * @returns {Object} Badge definition
   */
  getFIRSpecialistBadge() {
    return {
      id: 'fir-specialist',
      name: 'FIR Specialist',
      description: 'Mastered the procedures for escalating cybercrime complaints to FIRs and filing them in CCTNS with professional excellence',
      imageUrl: '/assets/badges/fir-specialist.svg',
      criteria: 'Complete Module 4: Escalation to FIR and CCTNS with 80% or higher score',
      moduleId: 'module-4-escalation-fir',
      points: 250,
      rarity: 'rare',
      category: 'investigation'
    };
  }

  /**
   * Check if Module 2 should be unlocked
   * @param {Object} params - Parameters containing modules and badges
   * @param {Array} params.modules - User's module progress
   * @param {Array} params.badges - User's earned badges
   * @returns {boolean} Whether Module 2 should be unlocked
   */
  shouldUnlockModule2({ modules, badges }) {
    // Check if Module 1 is completed
    const module1Progress = modules?.find(m => m.moduleId === 'module-1-intro-cybercrime');
    
    // If Module 1 is completed, unlock Module 2 regardless of badge
    // This ensures progression even if there's an issue with badge awarding
    if (module1Progress && module1Progress.status === 'completed') {
      return true;
    }
    
    return false;
  }

  /**
   * Check if Module 3 should be unlocked
   * @param {Object} params - Parameters containing modules and badges
   * @param {Array} params.modules - User's module progress
   * @param {Array} params.badges - User's earned badges
   * @returns {boolean} Whether Module 3 should be unlocked
   */
  shouldUnlockModule3({ modules, badges }) {
    // Check if Module 2 is completed
    const module2Progress = modules?.find(m => m.moduleId === 'module-2-complaint-categorization');
    
    // If Module 2 is completed, unlock Module 3 regardless of badge
    // This ensures progression even if there's an issue with badge awarding
    if (module2Progress && module2Progress.status === 'completed') {
      return true;
    }
    
    return false;
  }

  /**
   * Get next module information for Module 2
   * @returns {Object} Module 2 information
   */
  getModule2Info() {
    return {
      id: 'module-2-complaint-categorization',
      title: 'Complaint Categorization and Intake',
      description: 'Master the art of categorizing complaints and collecting accurate information from victims',
      moduleNumber: 2,
      estimatedDuration: 60,
      difficulty: 'intermediate',
      prerequisites: ['module-1-intro-cybercrime'],
      badgeReward: {
        id: 'first-responder',
        name: 'First Responder',
        description: 'Mastered complaint categorization and intake procedures'
      }
    };
  }

  /**
   * Get next module information for Module 3
   * @returns {Object} Module 3 information
   */
  getModule3Info() {
    return {
      id: 'module-3-time-critical-response',
      title: 'Time-Critical Response: Transaction Freezing',
      description: 'Master time-bound responses to fraudulent transactions and learn to effectively stop fund transfers',
      moduleNumber: 3,
      estimatedDuration: 45,
      difficulty: 'intermediate',
      prerequisites: ['module-2-complaint-categorization'],
      badgeReward: {
        id: 'digital-defender',
        name: 'Digital Defender',
        description: 'Mastered time-critical response procedures for transaction freezing'
      }
    };
  }
  
  /**
   * Get next module information for Module 4
   * @returns {Object} Module 4 information
   */
  getModule4Info() {
    return {
      id: 'module-4-escalation-fir',
      title: 'Escalation to FIR and CCTNS',
      description: 'Learn when and how to escalate complaints to FIR filing in CCTNS and follow proper procedural protocols',
      moduleNumber: 4,
      estimatedDuration: 60,
      difficulty: 'advanced',
      prerequisites: ['module-3-time-critical-response'],
      badgeReward: {
        id: 'fir-specialist',
        name: 'FIR Specialist',
        description: 'Mastered the escalation and FIR filing procedures'
      }
    };
  }
  
  /**
   * Check if Module 4 should be unlocked
   * @param {Object} params - Parameters containing modules and badges
   * @param {Array} params.modules - User's module progress
   * @param {Array} params.badges - User's earned badges
   * @returns {boolean} Whether Module 4 should be unlocked
   */
  shouldUnlockModule4({ modules, badges }) {
    // Check if Module 3 is completed
    const module3Progress = modules?.find(m => m.moduleId === 'module-3-time-critical-response');
    
    // If Module 3 is completed, unlock Module 4 regardless of badge
    // This ensures progression even if there's an issue with badge awarding
    if (module3Progress && module3Progress.status === 'completed') {
      return true;
    }
    
    return false;
  }
}

export default BadgeService;