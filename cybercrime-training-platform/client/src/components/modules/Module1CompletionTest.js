import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Button } from '../ui';
import ModuleCompletion from './ModuleCompletion';
import { updateProgress } from '../../store/actions/progressActions';

/**
 * Test component for Module 1 completion and badge awarding
 * This component simulates completing Module 1 to test the badge awarding functionality
 */
const Module1CompletionTest = () => {
  const dispatch = useDispatch();
  const [showCompletion, setShowCompletion] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock Module 1 data
  const module1 = {
    id: 'module-1-intro-cybercrime',
    title: 'Introduction to Cybercrime Investigation',
    description: 'Learn the fundamentals of cybercrime investigation and national systems',
    activities: [
      { id: 'onboarding', title: 'Interactive Onboarding' },
      { id: 'crime-quiz', title: 'Crime or Not a Crime Quiz' },
      { id: 'system-map', title: 'System Map Exploration' }
    ],
    minPassingScore: 80,
    badgeReward: {
      id: 'cyber-awareness-starter',
      name: 'Cyber Awareness Starter',
      description: 'Completed the introduction to cybercrime investigation with excellence',
      imageUrl: '/assets/badges/cyber-awareness-starter.svg'
    }
  };

  // Mock progress data for completed Module 1
  const completedProgress = {
    moduleId: 'module-1-intro-cybercrime',
    status: 'completed',
    activitiesCompleted: [
      { activityId: 'onboarding', status: 'completed', score: 50 },
      { activityId: 'crime-quiz', status: 'completed', score: 75 },
      { activityId: 'system-map', status: 'completed', score: 100 }
    ],
    currentScore: 85, // 85% - above passing score
    attempts: 1,
    startedAt: new Date(Date.now() - 2700000), // 45 minutes ago
    completedAt: new Date(),
    timeSpent: 2700 // 45 minutes in seconds
  };

  // Mock XP data
  const xpData = {
    earned: 100,
    total: 100,
    level: 1,
    leveledUp: false
  };

  // Mock next module data
  const nextModule = {
    id: 'module-2-complaint-categorization',
    title: 'Complaint Categorization and Intake',
    description: 'Master the art of categorizing complaints and collecting accurate information from victims',
    moduleNumber: 2
  };

  // Simulate completing Module 1
  const handleCompleteModule1 = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to complete module
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show completion screen
      setShowCompletion(true);
    } catch (error) {
      console.error('Error completing module:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle continue to next module
  const handleContinue = () => {
    console.log('Continuing to next module...');
    setShowCompletion(false);
  };

  if (showCompletion) {
    return (
      <ModuleCompletion
        module={module1}
        progress={completedProgress}
        badge={module1.badgeReward}
        xp={xpData}
        nextModule={nextModule}
        onContinue={handleContinue}
        className="max-w-4xl mx-auto"
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Module 1 Badge Awarding Test
          </h2>
          
          <div className="space-y-4 mb-6">
            <div>
              <h3 className="font-medium text-gray-900">Module Information:</h3>
              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                <li>• Title: {module1.title}</li>
                <li>• Activities: {module1.activities.length}</li>
                <li>• Passing Score: {module1.minPassingScore}%</li>
                <li>• Badge Reward: {module1.badgeReward.name}</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900">Simulated Progress:</h3>
              <ul className="mt-2 text-sm text-gray-600 space-y-1">
                <li>• Status: Completed</li>
                <li>• Score: {completedProgress.currentScore}%</li>
                <li>• Time Spent: {Math.floor(completedProgress.timeSpent / 60)} minutes</li>
                <li>• Activities Completed: {completedProgress.activitiesCompleted.length}/{module1.activities.length}</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-900 mb-2">Expected Behavior:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>1. Module completion screen will appear</li>
              <li>2. &ldquo;Cyber Awareness Starter&rdquo; badge will be awarded</li>
              <li>3. Congratulatory animation will play</li>
              <li>4. Next module (Module 2) will be unlocked</li>
              <li>5. User will earn 100 XP</li>
            </ul>
          </div>
          
          <Button
            variant="primary"
            size="lg"
            onClick={handleCompleteModule1}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Completing Module...
              </>
            ) : (
              'Complete Module 1 & Test Badge Awarding'
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Module1CompletionTest;