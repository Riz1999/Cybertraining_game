import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import XPBar from './XPBar';
import BadgeDisplay from './BadgeDisplay';
import ProgressSummary from './ProgressSummary';
import ModuleProgress from './ModuleProgress';
import Leaderboard from './Leaderboard';
import AchievementTracker from './AchievementTracker';
import { Card, Spinner } from '../ui';

// Import actions (to be implemented)
// import { getStatistics } from '../../store/actions/progressActions';
// import { getModules } from '../../store/actions/moduleActions';

/**
 * Gamification Dashboard component for displaying user's progress and achievements
 * @param {Object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} Gamification Dashboard component
 */
const GamificationDashboard = ({ className = '' }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { statistics, statisticsLoading } = useSelector(state => state.progress);
  const { modules, loading: modulesLoading } = useSelector(state => state.modules);
  const { progress } = useSelector(state => state.progress);
  
  // Fetch statistics and modules on component mount
  useEffect(() => {
    // Uncomment when actions are implemented
    // dispatch(getStatistics());
    // dispatch(getModules());
  }, [dispatch]);
  
  // Mock data for demonstration
  const mockStatistics = {
    totalXP: 450,
    level: 3,
    nextLevelProgress: 65,
    xpForNextLevel: 50,
    badgesCount: 2,
    completedModules: 2,
    inProgressModules: 1,
    totalModules: 7,
    completionPercentage: 28,
    totalTimeSpent: 3600, // 1 hour in seconds
    averageScore: 85,
  };
  
  const mockModules = [
    {
      id: 'module1',
      title: 'Introduction to Cybercrime Investigation',
      activities: [{ id: 'activity1' }, { id: 'activity2' }, { id: 'activity3' }],
    },
    {
      id: 'module2',
      title: 'Complaint Categorization and Intake',
      activities: [{ id: 'activity4' }, { id: 'activity5' }, { id: 'activity6' }],
    },
    {
      id: 'module3',
      title: 'Time-Critical Response: Transaction Freezing',
      activities: [{ id: 'activity7' }, { id: 'activity8' }, { id: 'activity9' }],
    },
  ];
  
  const mockProgress = {
    modules: [
      {
        moduleId: 'module1',
        status: 'completed',
        activitiesCompleted: [
          { activityId: 'activity1', status: 'completed' },
          { activityId: 'activity2', status: 'completed' },
          { activityId: 'activity3', status: 'completed' },
        ],
        currentScore: 85,
      },
      {
        moduleId: 'module2',
        status: 'in_progress',
        activitiesCompleted: [
          { activityId: 'activity4', status: 'completed' },
          { activityId: 'activity5', status: 'in_progress' },
          { activityId: 'activity6', status: 'not_started' },
        ],
        currentScore: 30,
      },
    ],
  };
  
  const mockBadges = [
    {
      id: 'badge1',
      name: 'Cyber Awareness Starter',
      description: 'Completed the introduction to cybercrime investigation',
      imageUrl: 'https://via.placeholder.com/80',
    },
    {
      id: 'badge2',
      name: 'First Responder',
      description: 'Mastered the intake and categorization of cybercrime complaints',
      imageUrl: 'https://via.placeholder.com/80',
    },
  ];
  
  const mockAchievements = [
    {
      id: 'achievement1',
      name: 'First Steps',
      description: 'Complete your first module',
      completed: true,
      xpReward: 50,
    },
    {
      id: 'achievement2',
      name: 'Perfect Score',
      description: 'Get a perfect score on any module',
      completed: true,
      xpReward: 100,
    },
    {
      id: 'achievement3',
      name: 'Badge Collector',
      description: 'Earn 5 badges',
      completed: false,
      progress: 40,
      progressText: '2/5 badges',
      xpReward: 150,
    },
    {
      id: 'achievement4',
      name: 'Dedicated Learner',
      description: 'Spend 10 hours on the platform',
      completed: false,
      progress: 10,
      progressText: '1/10 hours',
      xpReward: 200,
    },
  ];
  
  const mockLeaderboard = [
    { id: '1', rank: 1, name: 'Officer Kumar', level: 5, xp: 750, avatar: 'https://via.placeholder.com/40' },
    { id: '2', rank: 2, name: 'Officer Singh', level: 4, xp: 620, avatar: 'https://via.placeholder.com/40' },
    { id: user?.id || '3', rank: 3, name: user?.name || 'You', level: 3, xp: 450, avatar: 'https://via.placeholder.com/40' },
    { id: '4', rank: 4, name: 'Officer Patel', level: 3, xp: 380, avatar: 'https://via.placeholder.com/40' },
    { id: '5', rank: 5, name: 'Officer Sharma', level: 2, xp: 250, avatar: 'https://via.placeholder.com/40' },
  ];
  
  // Use real data if available, otherwise use mock data
  const displayStatistics = statistics || mockStatistics;
  const displayModules = modules || mockModules;
  const displayProgress = progress || mockProgress;
  const displayBadges = user?.badgesEarned || mockBadges;
  
  // Show loading state
  if (statisticsLoading || modulesLoading) {
    return (
      <div className={`flex justify-center items-center py-12 ${className}`}>
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* XP and Level */}
      <XPBar
        level={displayStatistics.level}
        progress={displayStatistics.nextLevelProgress}
        xpForNextLevel={displayStatistics.xpForNextLevel}
      />
      
      {/* Progress Summary */}
      <ProgressSummary statistics={displayStatistics} />
      
      {/* Badges */}
      <Card>
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Earned Badges</h3>
        </div>
        <div className="p-4">
          <BadgeDisplay badges={displayBadges} showEmpty maxDisplay={5} />
        </div>
      </Card>
      
      {/* Module Progress */}
      <ModuleProgress modules={displayModules} progress={displayProgress} />
      
      {/* Two-column layout for achievements and leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AchievementTracker achievements={mockAchievements} />
        <Leaderboard 
          users={mockLeaderboard} 
          currentUserId={user?.id || '3'} 
          title="Top Performers" 
        />
      </div>
    </div>
  );
};

export default GamificationDashboard;