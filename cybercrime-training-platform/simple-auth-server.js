const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5001; // Use a different port to avoid conflicts

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON request bodies
app.use(express.json());

// Simple health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Simple auth server is working correctly',
    timestamp: new Date().toISOString()
  });
});

// Mock register endpoint
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, department } = req.body;
  
  console.log('Register request received:', { name, email, department });
  
  // Simple validation
  if (!name || !email || !password || !department) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields'
    });
  }
  
  // Mock successful response
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: '12345',
        name,
        email,
        role: 'trainee',
        department
      },
      tokens: {
        access: {
          token: 'mock-access-token',
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        refresh: {
          token: 'mock-refresh-token',
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      }
    }
  });
});

// Mock login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  console.log('Login request received:', { email });
  
  // Simple validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }
  
  // Mock successful response
  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: '12345',
        name: 'Test User',
        email,
        role: 'trainee',
        department: 'Test Department',
        badgesEarned: []
      },
      tokens: {
        access: {
          token: 'mock-access-token',
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        refresh: {
          token: 'mock-refresh-token',
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      }
    }
  });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Simple auth server running on port ${PORT}`);
  console.log(`Test the server at http://localhost:${PORT}/api/test`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  // Keep the server running
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  // Keep the server running
});