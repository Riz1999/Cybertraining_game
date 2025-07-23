import React from 'react';
import { Card, Button } from '../ui';
import BadgeService from '../../services/BadgeService';

/**
 * Module Unlock Tester Component
 * For testing module unlocking logic
 */
const ModuleUnlockTester = ({ progress, userBadges }) => {
  const badgeService = new BadgeService();
  
  // Mock progress data for testing
  const mockProgress = {
    modules: [
      {
        moduleId: 'module-1-intro-cybercrime',
        status: 'completed',
        currentScore: 85,
        activitiesCompleted: [
          { activityId: 'activity-1', status: 'completed', score: 90 },
          { activityId: 'activity-2', status: 'completed', score: 80 }
        ]
      }
    ]
  };
  
  // Mock badges for testing
  const mockBadges = [
    {
      id: 'cyber-awareness-starter',
      name: 'Cyber Awareness Starter',
      description: 'Completed the introduction to cybercrime investigation with excellence',
      imageUrl: '/assets/badges/cyber-awareness-starter.svg',
      earnedAt: new Date()
    }
  ];
  
  // Test module unlocking logic
  const testModule2Unlock = () => {
    const isModule2Unlocked = badgeService.shouldUnlockModule2({ 
      modules: progress?.modules || mockProgress.modules, 
      badges: userBadges || mockBadges 
    });
    
    return isModule2Unlocked;
  };
  
  const testModule3Unlock = () => {
    // Add Module 2 completion to mock data
    const mockProgressWithModule2 = {
      modules: [
        ...mockProgress.modules,
        {
          moduleId: 'module-2-complaint-categorization',
          status: 'completed',
          currentScore: 85,
          activitiesCompleted: [
            { activityId: 'activity-1', status: 'completed', score: 90 },
            { activityId: 'activity-2', status: 'completed', score: 80 }
          ]
        }
      ]
    };
    
    const mockBadgesWithModule2 = [
      ...mockBadges,
      {
        id: 'first-responder',
        name: 'First Responder',
        description: 'Mastered complaint categorization and intake procedures',
        imageUrl: '/assets/badges/first-responder.svg',
        earnedAt: new Date()
      }
    ];
    
    const isModule3Unlocked = badgeService.shouldUnlockModule3({ 
      modules: progress?.modules || mockProgressWithModule2.modules, 
      badges: userBadges || mockBadgesWithModule2 
    });
    
    return isModule3Unlocked;
  };
  
  return (
    <Card>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Module Unlock Tester</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Module 2 Unlock Test</h4>
            <div className="flex items-center space-x-2">
              <span className="text-gray-700">Is Module 2 Unlocked:</span>
              <span className={`font-medium ${testModule2Unlock() ? 'text-green-600' : 'text-red-600'}`}>
                {testModule2Unlock() ? 'Yes' : 'No'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Module 2 should be unlocked if Module 1 is completed.
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Module 3 Unlock Test</h4>
            <div className="flex items-center space-x-2">
              <span className="text-gray-700">Is Module 3 Unlocked:</span>
              <span className={`font-medium ${testModule3Unlock() ? 'text-green-600' : 'text-red-600'}`}>
                {testModule3Unlock() ? 'Yes' : 'No'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Module 3 should be unlocked if Module 2 is completed.
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Module Unlock Logic</h4>
            <p className="text-sm text-blue-700">
              The updated module unlocking logic now only requires completion of the previous module, 
              regardless of whether the badge was earned. This ensures users can progress through the 
              training even if there are issues with the badge awarding system.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ModuleUnlockTester;