/**
 * Activity model for tracking user activity
 */
const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'login',
      'logout',
      'module_start',
      'module_complete',
      'activity_start',
      'activity_complete',
      'badge_earned',
      'certificate_issued',
      'profile_update',
      'password_change',
      'xp_earned'
    ],
    required: true
  },
  details: {
    moduleId: {
      type: String
    },
    activityId: {
      type: String
    },
    badgeId: {
      type: String
    },
    certificateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Certificate'
    },
    score: {
      type: Number
    },
    xpEarned: {
      type: Number
    },
    timeSpent: {
      type: Number
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
ActivitySchema.index({ userId: 1, createdAt: -1 });
ActivitySchema.index({ type: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', ActivitySchema);