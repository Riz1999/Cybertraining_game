/**
 * Token model for refresh tokens
 */
const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['refresh', 'reset', 'verification'],
    default: 'refresh'
  },
  expires: {
    type: Date,
    required: true
  },
  blacklisted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '30d' // Automatically remove documents after 30 days
  }
});

module.exports = mongoose.model('Token', TokenSchema);