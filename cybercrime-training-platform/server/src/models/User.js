const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['trainee', 'trainer', 'admin'],
    default: 'trainee'
  },
  department: {
    type: String,
    required: [true, 'Please add a department'],
    trim: true
  },
  designation: {
    type: String,
    trim: true
  },
  rank: {
    type: String,
    trim: true
  },
  phoneNumber: {
    type: String,
    match: [
      /^(\+\d{1,3}[- ]?)?\d{10}$/,
      'Please add a valid phone number'
    ]
  },
  profileImage: {
    type: String,
    default: 'default-profile.png'
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  location: {
    type: String,
    trim: true
  },
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      inApp: {
        type: Boolean,
        default: true
      }
    },
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    language: {
      type: String,
      enum: ['en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa', 'or', 'as'],
      default: 'en'
    }
  },
  badgesEarned: [
    {
      id: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      imageUrl: {
        type: String,
        required: true
      },
      earnedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  totalXP: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  certifications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certificate'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);