import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Badge, ProgressBar } from '../ui';
import BadgeService from '../../services/BadgeService';

/**
 * Module Card Component
 * Displays module information, progress, and unlock status
 */
const ModuleCard = ({ module, progress, userBadges, className = '' }) => {
  const badgeService = new BadgeService();
  
  // Calculate module progress
  const getModuleProgress = () => {
    if (!progress?.modules) return { status: 'not_started', score: 0, progress: 0 };
    
    const moduleProgress = progress.modules.find(m => m.moduleId === module.id);
    if (!moduleProgress) return { status: 'not_started', score: 0, progress: 0 };
    
    const totalActivities = module.activities?.length || 1;
    const completedActivities = moduleProgress.activitiesCompleted?.length || 0;
    const progressPercentage = Math.round((completedActivities / totalActivities) * 100);
    
    return {
      status: moduleProgress.status,
      score: moduleProgress.currentScore || 0,
      progress: progressPercentage,
      timeSpent: moduleProgress.timeSpent || 0,
      completedAt: moduleProgress.completedAt
    };
  };

  // Check if module is unlocked
  const isModuleUnlocked = () => {
    if (module.id === 'module-1-intro-cybercrime') return true;
    
    if (module.id === 'module-2-complaint-categorization') {
      return badgeService.shouldUnlockModule2({ modules: progress?.modules, badges: userBadges });
    }
    
    if (module.id === 'module-3-time-critical-response') {
      return badgeService.shouldUnlockModule3({ modules: progress?.modules, badges: userBadges });
    }
    
    return false;
  };

  // Get module badge
  const getModuleBadge = () => {
    if (!userBadges) return null;
    
    const badgeMapping = {
      'module-1-intro-cybercrime': 'cyber-awareness-starter',
      'module-2-complaint-categorization': 'first-responder',
      'module-3-time-critical-response': 'digital-defender'
    };
    
    const badgeId = badgeMapping[module.id];
    return userBadges.find(badge => badge.id === badgeId);
  };

  // Get unlock requirements text
  const getUnlockRequirements = () => {
    if (module.id === 'module-2-complaint-categorization') {
      return 'Complete Module 1: Introduction to Cybercrime Investigation';
    }
    if (module.id === 'module-3-time-critical-response') {
      return 'Complete Module 2: Complaint Categorization and Intake';
    }
    return '';
  };

  const moduleProgress = getModuleProgress();
  const isUnlocked = isModuleUnlocked();
  const earnedBadge = getModuleBadge();
  const unlockRequirements = getUnlockRequirements();

  // Format time spent
  const formatTimeSpent = (seconds) => {
    if (!seconds) return '0 min';
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  // Get status color and text
  const getStatusInfo = () => {
    if (!isUnlocked) {
      return { color: 'gray', text: 'Locked', variant: 'outline' };
    }
    
    switch (moduleProgress.status) {
      case 'completed':
        return { color: 'green', text: 'Completed', variant: 'success' };
      case 'in_progress':
        return { color: 'blue', text: 'In Progress', variant: 'info' };
      default:
        return { color: 'gray', text: 'Not Started', variant: 'outline' };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Card className={`${className} ${!isUnlocked ? 'opacity-75' : ''}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{module.title}</h3>
              {earnedBadge && (
                <div className="flex items-center space-x-1">
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm text-yellow-600 font-medium">{earnedBadge.name}</span>
                </div>
              )}
            </div>
            <p className="text-gray-600 text-sm mb-3">{module.description}</p>
            
            {/* Module Info */}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>📚 {module.activities?.length || 0} activities</span>
              <span>⏱️ {module.estimatedDuration} min</span>
              <span>📊 {module.difficulty}</span>
            </div>
          </div>
          
          <Badge variant={statusInfo.variant}>
            {statusInfo.text}
          </Badge>
        </div>

        {/* Progress Section */}
        {isUnlocked && moduleProgress.status !== 'not_started' && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">{moduleProgress.progress}%</span>
            </div>
            <ProgressBar progress={moduleProgress.progress} className="h-2 mb-2" />
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Score: {moduleProgress.score}%</span>
              <span>Time: {formatTimeSpent(moduleProgress.timeSpent)}</span>
            </div>
          </div>
        )}

        {/* Unlock Requirements */}
        {!isUnlocked && unlockRequirements && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-yellow-800">Unlock Requirements</p>
                <p className="text-sm text-yellow-700">{unlockRequirements}</p>
              </div>
            </div>
          </div>
        )}

        {/* Badge Reward Preview */}
        {module.badgeReward && !earnedBadge && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Earn Badge: {module.badgeReward.name}</p>
                <p className="text-sm text-blue-700">{module.badgeReward.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end">
          {isUnlocked ? (
            <Link to={`/modules/${module.id}`}>
              <Button variant="primary">
                {moduleProgress.status === 'completed' ? 'Review Module' : 
                 moduleProgress.status === 'in_progress' ? 'Continue' : 'Start Module'}
              </Button>
            </Link>
          ) : (
            <Button variant="outline" disabled>
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Locked
            </Button>
          )}
        </div>

        {/* Completion Date */}
        {moduleProgress.completedAt && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Completed on {new Date(moduleProgress.completedAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ModuleCard;