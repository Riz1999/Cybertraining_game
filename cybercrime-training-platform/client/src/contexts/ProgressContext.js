import React, { createContext, useContext, useState } from 'react';

// Create the progress context
const ProgressContext = createContext();

// Progress provider component
export const ProgressProvider = ({ children }) => {
  const [userProgress, setUserProgress] = useState({});

  // Get user progress
  const getUserProgress = async (userId) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock progress data
        const progress = {
          userId,
          completedModules: ['module-1-intro-cybercrime', 'module-2-complaint-categorization'],
          inProgressModules: ['module-3-time-critical-response'],
          totalXP: 350,
          level: 2,
          badges: [
            {
              id: 'badge1',
              name: 'Cyber Awareness Starter',
              earnedAt: new Date().toISOString()
            },
            {
              id: 'badge2',
              name: 'First Responder',
              earnedAt: new Date().toISOString()
            }
          ]
        };
        
        setUserProgress(prevProgress => ({
          ...prevProgress,
          [userId]: progress
        }));
        
        resolve(progress);
      }, 500);
    });
  };

  // Update user progress
  const updateProgress = async (userId, progressData) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        setUserProgress(prevProgress => ({
          ...prevProgress,
          [userId]: {
            ...(prevProgress[userId] || {}),
            ...progressData
          }
        }));
        
        resolve({ success: true });
      }, 500);
    });
  };

  // Context value
  const value = {
    userProgress,
    getUserProgress,
    updateProgress
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

// Custom hook to use progress context
export const useProgress = () => {
  return useContext(ProgressContext);
};

export default ProgressContext;