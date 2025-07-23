/**
 * Certificate model
 */
const mongoose = require('mongoose');
const crypto = require('crypto');

const CertificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  certificateNumber: {
    type: String,
    unique: true,
    default: function() {
      // Generate a unique certificate number
      const timestamp = Date.now().toString();
      const randomString = crypto.randomBytes(4).toString('hex');
      return `CERT-${timestamp.substring(timestamp.length - 6)}-${randomString.toUpperCase()}`;
    }
  },
  title: {
    type: String,
    required: [true, 'Please add a certificate title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a certificate description']
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date
  },
  badges: [{
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    }
  }],
  modules: [{
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    score: {
      type: Number,
      required: true
    }
  }],
  overallScore: {
    type: Number,
    required: true
  },
  verificationCode: {
    type: String,
    unique: true,
    default: function() {
      // Generate a verification code
      return crypto.randomBytes(16).toString('hex');
    }
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'revoked'],
    default: 'active'
  },
  metadata: {
    issuedBy: {
      type: String,
      required: true
    },
    authoritySignature: {
      type: String
    },
    authorityName: {
      type: String
    },
    authorityDesignation: {
      type: String
    }
  }
});

module.exports = mongoose.model('Certificate', CertificateSchema);