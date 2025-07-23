/**
 * Database seeder utility
 * Populates the database with initial data
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { connectDB, closeDB } = require('../config/db');
const User = require('../models/User');
const Module = require('../models/Module');
const Badge = require('../models/Badge');
const logger = require('./logger');

// Load environment variables
require('dotenv').config();

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    department: 'IT',
    designation: 'System Administrator',
    rank: 'Inspector',
    phoneNumber: '9876543210',
    location: 'Delhi',
  },
  {
    name: 'Trainer User',
    email: 'trainer@example.com',
    password: 'password123',
    role: 'trainer',
    department: 'Cybercrime Cell',
    designation: 'Training Officer',
    rank: 'Sub-Inspector',
    phoneNumber: '9876543211',
    location: 'Mumbai',
  },
  {
    name: 'Trainee User',
    email: 'trainee@example.com',
    password: 'password123',
    role: 'trainee',
    department: 'Police Academy',
    designation: 'Recruit',
    rank: 'Constable',
    phoneNumber: '9876543212',
    location: 'Bangalore',
  },
];

const badges = [
  {
    id: 'cyber_awareness_starter',
    name: 'Cyber Awareness Starter',
    description: 'Completed the Introduction to Cybercrime Investigation module',
    imageUrl: '/badges/cyber_awareness_starter.png',
    criteria: 'Complete all activities in Module 1',
    moduleId: 'module_1',
  },
  {
    id: 'first_responder',
    name: 'First Responder',
    description: 'Completed the Complaint Categorization and Intake module',
    imageUrl: '/badges/first_responder.png',
    criteria: 'Complete all activities in Module 2',
    moduleId: 'module_2',
  },
  {
    id: 'digital_defender',
    name: 'Digital Defender',
    description: 'Completed the Time-Critical Response module',
    imageUrl: '/badges/digital_defender.png',
    criteria: 'Complete all activities in Module 3',
    moduleId: 'module_3',
  },
  {
    id: 'fir_specialist',
    name: 'FIR Specialist',
    description: 'Completed the Escalation to FIR and CCTNS module',
    imageUrl: '/badges/fir_specialist.png',
    criteria: 'Complete all activities in Module 4',
    moduleId: 'module_4',
  },
  {
    id: 'pattern_profiler',
    name: 'Pattern Profiler',
    description: 'Completed the Analysis and Evidence Gathering module',
    imageUrl: '/badges/pattern_profiler.png',
    criteria: 'Complete all activities in Module 5',
    moduleId: 'module_5',
  },
  {
    id: 'closure_commander',
    name: 'Closure Commander',
    description: 'Completed the Reporting and Final Action module',
    imageUrl: '/badges/closure_commander.png',
    criteria: 'Complete all activities in Module 6',
    moduleId: 'module_6',
  },
  {
    id: 'victim_ally',
    name: 'Victim Ally',
    description: 'Completed the Ethics and Victim Communication module',
    imageUrl: '/badges/victim_ally.png',
    criteria: 'Complete all activities in Module 7',
    moduleId: 'module_7',
  },
];

const modules = [
  {
    id: 'module_1',
    title: 'Introduction to Cybercrime Investigation',
    description: 'Learn about different types of cybercrimes and national systems',
    objectives: [
      'Understand the basics of cybercrime',
      'Learn about national cybercrime systems',
      'Identify different types of cybercrimes',
    ],
    prerequisites: {
      modules: [],
      xpLevel: 0,
      badges: [],
    },
    sequence: {
      order: 1,
      category: 'core',
      track: 'main',
      isGated: false,
    },
    activities: [
      {
        id: 'activity_1_1',
        type: 'interactive',
        title: 'Onboarding with Senior Officer',
        content: {
          type: 'avatar_dialog',
          avatar: '/avatars/senior_officer.png',
          dialog: [
            {
              speaker: 'officer',
              text: 'Welcome to the Cybercrime Investigation Training Program!',
            },
            {
              speaker: 'officer',
              text: 'I\'ll be your guide through this training journey.',
            },
          ],
        },
        points: 10,
        order: 1,
        isRequired: true,
      },
      {
        id: 'activity_1_2',
        type: 'dragdrop',
        title: 'Crime or Not a Crime?',
        content: {
          type: 'categorization',
          items: [
            {
              id: 'item_1',
              text: 'Sending threatening messages on social media',
              category: 'crime',
            },
            {
              id: 'item_2',
              text: 'Downloading music from official streaming services',
              category: 'not_crime',
            },
          ],
          categories: ['crime', 'not_crime'],
        },
        points: 20,
        order: 2,
        isRequired: true,
        passingScore: 80,
      },
      {
        id: 'activity_1_3',
        type: 'interactive',
        title: 'System Map Exploration',
        content: {
          type: 'clickable_map',
          mapImage: '/images/system_map.png',
          clickableAreas: [
            {
              id: 'ncrp',
              title: 'NCRP',
              description: 'National Cybercrime Reporting Portal',
              position: { x: 100, y: 100 },
              width: 50,
              height: 50,
            },
            {
              id: 'i4c',
              title: 'I4C',
              description: 'Indian Cybercrime Coordination Centre',
              position: { x: 200, y: 100 },
              width: 50,
              height: 50,
            },
          ],
        },
        points: 20,
        order: 3,
        isRequired: true,
      },
    ],
    badgeReward: {
      id: 'cyber_awareness_starter',
      name: 'Cyber Awareness Starter',
      description: 'Completed the Introduction to Cybercrime Investigation module',
      imageUrl: '/badges/cyber_awareness_starter.png',
      criteria: 'Complete all required activities in the module',
    },
    minPassingScore: 70,
    estimatedDuration: 60,
    version: '1.0',
    isPublished: true,
    metadata: {
      difficulty: 'beginner',
      tags: ['introduction', 'basics', 'cybercrime'],
    },
  },
  {
    id: 'module_2',
    title: 'Complaint Categorization and Intake',
    description: 'Learn how to categorize cybercrime complaints and collect accurate information',
    objectives: [
      'Categorize different types of cybercrime complaints',
      'Learn how to collect accurate information from victims',
      'Complete NCRP forms correctly',
    ],
    prerequisites: {
      modules: ['module_1'],
      xpLevel: 50,
      badges: ['cyber_awareness_starter'],
    },
    sequence: {
      order: 2,
      category: 'core',
      track: 'main',
      isGated: true,
    },
    activities: [
      {
        id: 'activity_2_1',
        type: 'roleplay',
        title: 'Victim Dialog Scenario',
        content: {
          type: 'dialog_simulation',
          scenario: 'A victim reports a phishing attempt',
          characters: [
            {
              id: 'victim',
              name: 'Victim',
              avatar: '/avatars/victim.png',
            },
            {
              id: 'officer',
              name: 'Officer',
              avatar: '/avatars/officer.png',
              isPlayer: true,
            },
          ],
          dialog: [
            {
              speaker: 'victim',
              text: 'I received an email asking for my bank details.',
            },
            {
              speaker: 'officer',
              options: [
                {
                  text: 'Did you provide any information?',
                  correct: true,
                  response: 'No, I didn\'t. But I almost clicked on the link.',
                },
                {
                  text: 'You shouldn\'t click on suspicious links.',
                  correct: false,
                  response: 'I know that now, but I need help reporting this.',
                },
              ],
            },
          ],
        },
        points: 20,
        order: 1,
        isRequired: true,
      },
    ],
    badgeReward: {
      id: 'first_responder',
      name: 'First Responder',
      description: 'Completed the Complaint Categorization and Intake module',
      imageUrl: '/badges/first_responder.png',
      criteria: 'Complete all required activities in the module',
    },
    minPassingScore: 70,
    estimatedDuration: 90,
    version: '1.0',
    isPublished: true,
    metadata: {
      difficulty: 'beginner',
      tags: ['intake', 'categorization', 'forms'],
    },
  },
];

/**
 * Import data into database
 */
const importData = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing data
    await User.deleteMany();
    await Module.deleteMany();
    await Badge.deleteMany();
    
    // Create users with hashed passwords
    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        return user;
      })
    );
    
    // Insert data
    await User.insertMany(hashedUsers);
    await Badge.insertMany(badges);
    await Module.insertMany(modules);
    
    logger.info('Data imported successfully');
    process.exit();
  } catch (error) {
    logger.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Delete data from database
 */
const deleteData = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing data
    await User.deleteMany();
    await Module.deleteMany();
    await Badge.deleteMany();
    
    logger.info('Data deleted successfully');
    process.exit();
  } catch (error) {
    logger.error(`Error deleting data: ${error.message}`);
    process.exit(1);
  }
};

// Check command line arguments
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  logger.info('Please use -i to import data or -d to delete data');
  process.exit();
}