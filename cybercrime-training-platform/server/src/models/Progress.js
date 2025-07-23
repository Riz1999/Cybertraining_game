const mongoose = require('mongoose');

const ProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  modules: [
    {
      moduleId: {
        type: String,
        required: true
      },
      status: {
        type: String,
        enum: ['not_started', 'in_progress', 'completed', 'failed'],
        default: 'not_started'
      },
      activitiesCompleted: [
        {
          activityId: {
            type: String,
            required: true
          },
          status: {
            type: String,
            enum: ['not_started', 'in_progress', 'completed'],
            default: 'not_started'
          },
          score: {
            type: Number,
            default: 0
          },
          attempts: {
            type: Number,
            default: 0
          },
          userResponses: {
            type: [mongoose.Schema.Types.Mixed],
            default: []
          }
        }
      ],
      currentScore: {
        type: Number,
        default: 0
      },
      attempts: {
        type: Number,
        default: 0
      },
      startedAt: {
        type: Date
      },
      completedAt: {
        type: Date
      },
      timeSpent: {
        type: Number,
        default: 0
      }
    }
  ],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Progress', ProgressSchema);