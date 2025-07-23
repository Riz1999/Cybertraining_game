const mongoose = require('mongoose');
const { validateModuleContent } = require('../utils/moduleValidator');

const ModuleSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Please add a module ID'],
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  objectives: {
    type: [String],
    required: [true, 'Please add at least one objective'],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one objective is required'
    }
  },
  // Enhanced prerequisites with more detailed structure
  prerequisites: {
    modules: {
      type: [String],
      default: []
    },
    xpLevel: {
      type: Number,
      default: 0
    },
    badges: {
      type: [String],
      default: []
    },
    customRequirements: {
      type: [
        {
          type: {
            type: String,
            enum: ['score', 'activity', 'time', 'custom'],
            required: true
          },
          value: {
            type: mongoose.Schema.Types.Mixed,
            required: true
          },
          description: {
            type: String,
            required: true
          }
        }
      ],
      default: []
    }
  },
  // Module sequence information
  sequence: {
    order: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      enum: ['core', 'optional', 'advanced'],
      default: 'core'
    },
    track: {
      type: String,
      default: 'main'
    },
    isGated: {
      type: Boolean,
      default: true
    }
  },
  activities: [
    {
      id: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ['quiz', 'simulation', 'roleplay', 'dragdrop', 'interactive'],
        required: true
      },
      title: {
        type: String,
        required: true
      },
      content: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
        validate: {
          validator: function(v) {
            return validateModuleContent(this.type, v);
          },
          message: 'Content validation failed for the activity type'
        }
      },
      points: {
        type: Number,
        required: true,
        min: [0, 'Points cannot be negative']
      },
      timeLimit: {
        type: Number,
        min: [0, 'Time limit cannot be negative']
      },
      order: {
        type: Number,
        default: 0
      },
      isRequired: {
        type: Boolean,
        default: true
      },
      passingScore: {
        type: Number,
        min: [0, 'Passing score cannot be negative'],
        max: [100, 'Passing score cannot be more than 100'],
        default: 70
      }
    }
  ],
  badgeReward: {
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
    criteria: {
      type: String,
      default: 'Complete all required activities in the module'
    }
  },
  minPassingScore: {
    type: Number,
    required: [true, 'Please add a minimum passing score'],
    min: [0, 'Minimum passing score cannot be negative'],
    max: [100, 'Minimum passing score cannot be more than 100']
  },
  estimatedDuration: {
    type: Number,
    required: [true, 'Please add an estimated duration in minutes']
  },
  version: {
    type: String,
    required: [true, 'Please add a version number'],
    default: '1.0'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  // Additional metadata
  metadata: {
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    tags: {
      type: [String],
      default: []
    },
    recommendedFor: {
      type: [String],
      default: []
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Module', ModuleSchema);