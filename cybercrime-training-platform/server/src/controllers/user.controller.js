/**
 * User Controller
 * Handles user profile operations
 */
const User = require('../models/User');
const Progress = require('../models/Progress');
const logger = require('../utils/logger');

/**
 * Get user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getProfile = async (req, res) => {
  try {
    // Get user profile from database
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    
    // Get user progress
    const progress = await Progress.findOne({ userId: req.user.id });
    
    // Format response
    const profile = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      designation: user.designation,
      rank: user.rank,
      phoneNumber: user.phoneNumber,
      profileImage: user.profileImage,
      bio: user.bio,
      location: user.location,
      preferences: user.preferences,
      badgesEarned: user.badgesEarned,
      totalXP: user.totalXP,
      level: user.level,
      moduleProgress: progress ? progress.modules : [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLogin: user.lastLogin,
    };
    
    res.status(200).json({
      success: true,
      data: {
        profile,
      },
    });
  } catch (error) {
    logger.error('Error fetching user profile:', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message,
    });
  }
};

/**
 * Update user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateProfile = async (req, res) => {
  try {
    // Fields that can be updated
    const updatableFields = [
      'name',
      'department',
      'designation',
      'rank',
      'phoneNumber',
      'bio',
      'location',
      'preferences',
    ];
    
    // Filter request body to only include updatable fields
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (updatableFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });
    
    // Add updatedAt timestamp
    updates.updatedAt = Date.now();
    
    // Update user profile
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    
    // Get user progress
    const progress = await Progress.findOne({ userId: req.user.id });
    
    // Format response
    const profile = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      designation: user.designation,
      rank: user.rank,
      phoneNumber: user.phoneNumber,
      profileImage: user.profileImage,
      bio: user.bio,
      location: user.location,
      preferences: user.preferences,
      badgesEarned: user.badgesEarned,
      totalXP: user.totalXP,
      level: user.level,
      moduleProgress: progress ? progress.modules : [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      lastLogin: user.lastLogin,
    };
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        profile,
      },
    });
  } catch (error) {
    logger.error('Error updating user profile:', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Error updating user profile',
      error: error.message,
    });
  }
};

/**
 * Upload profile image
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.uploadProfileImage = async (req, res) => {
  try {
    // In a real implementation, this would handle file upload
    // For now, we'll just update the profileImage field with a mock URL
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        $set: { 
          profileImage: `profile-${req.user.id}.jpg`,
          updatedAt: Date.now()
        } 
      },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Profile image uploaded successfully',
      data: {
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    logger.error('Error uploading profile image:', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Error uploading profile image',
      error: error.message,
    });
  }
};

/**
 * Update user preferences
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updatePreferences = async (req, res) => {
  try {
    const { preferences } = req.body;
    
    if (!preferences) {
      return res.status(400).json({
        success: false,
        message: 'Preferences are required',
      });
    }
    
    // Update user preferences
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        $set: { 
          preferences,
          updatedAt: Date.now()
        } 
      },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        preferences: user.preferences,
      },
    });
  } catch (error) {
    logger.error('Error updating preferences:', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Error updating preferences',
      error: error.message,
    });
  }
};