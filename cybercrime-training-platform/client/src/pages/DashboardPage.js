import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';
import Tabs from '../components/ui/Tabs';
import Grid from '../components/layout/Grid';
import ModuleCard from '../components/modules/ModuleCard';
import LoginStreak from '../components/gamification/LoginStreak';
import XPBar from '../components/gamification/XPBar';
import ProgressSummary from '../components/gamification/ProgressSummary';
import GamificationNotification from '../components/gamification/GamificationNotification';
import ProgressChart from '../components/gamification/ProgressChart';
import CertificationProgress from '../components/gamification/CertificationProgress';
import ActivityHistory from '../components/gamification/ActivityHistory';
import BadgeShowcase from '../components/dashboard/BadgeShowcase';
import BadgeService from '../services/BadgeService';
import { 
  getProgress, 
  getStatistics, 
  updateLoginStreak,
  getWeakAreas,
  checkCertificationEligibility
} from '../store/actions/progressActions';
import {
  getActivityHistory,
  getProgressHistory
} from '../store/actions/activityActions';

// Mock data for demonstration
const mockUser = {
  name: 'Officer Singh',
  department: 'Cybercrime Cell, Delhi Police',
  joinedDate: 'June 15, 2025',
  badgesEarned: [
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
  ],
  overallProgress: 42,
  moduleProgress: [
    {
      moduleId: 'module1',
      status: 'completed',
      currentScore: 85,
    },
    {
      moduleId: 'module2',
      status: 'in_progress',
      currentScore: 30,
    },
  ],
};

const mockModules = [
  {
    id: 'module-1-intro-cybercrime',
    title: 'Introduction to Cybercrime Investigation',
    description: 'Learn about different types of cybercrimes and national systems.',
    objectives: [
      'Understand the basics of cybercrime investigation',
      'Identify different types of cybercrimes',
      'Learn about national cybercrime systems',
    ],
    estimatedDuration: 45,
    activities: [1, 2, 3],
    badgeReward: {
      name: 'Cyber Awareness Starter',
      imageUrl: '/assets/badges/cyber-awareness-starter.svg',
    },
    minPassingScore: 70,
  },
  {
    id: 'module-2-complaint-categorization',
    title: 'Complaint Categorization and Intake',
    description: 'Master victim interviews, complaint categorization, and NCRP form completion.',
    objectives: [
      'Conduct empathetic victim interviews',
      'Accurately categorize different types of cybercrimes',
      'Complete NCRP forms with precision'
    ],
    estimatedDuration: 75,
    activities: [1, 2, 3],
    badgeReward: {
      name: 'First Responder',
      imageUrl: '/assets/badges/first-responder.svg',
    },
    minPassingScore: 75,
  },
  {
    id: 'module-3-time-critical-response',
    title: 'Time-Critical Response: Transaction Freezing',
    description: 'Practice time-bound responses to fraudulent transactions.',
    objectives: [
      'Learn time-critical response procedures',
      'Practice transaction freezing workflows',
      'Understand bank coordination protocols',
    ],
    estimatedDuration: 75,
    activities: [1, 2, 3, 4, 5],
    badgeReward: {
      name: 'Digital Defender',
      imageUrl: '/assets/badges/digital-defender.svg',
    },
    minPassingScore: 80,
  },
  {
    id: 'module-4-escalation-fir',
    title: 'Escalation to FIR and CCTNS',
    description: 'Learn when and how to escalate cybercrime complaints to formal FIRs and file them in the CCTNS system.',
    objectives: [
      'Understand the criteria for escalating cybercrime complaints to FIRs',
      'Learn the proper procedures for filing cases in CCTNS',
      'Master the documentation requirements for formal investigations',
      'Identify time-sensitive cases requiring immediate escalation',
      'Understand the legal framework for cybercrime investigation'
    ],
    estimatedDuration: 60,
    activities: [1, 2, 3],
    badgeReward: {
      name: 'FIR Specialist',
      imageUrl: '/assets/badges/fir-specialist.svg',
    },
    minPassingScore: 80,
  },
  {
    id: 'module-5-financial-fraud-investigation',
    title: 'Financial Fraud Investigation',
    description: 'Master the end-to-end investigation process for financial fraud cases, from complaint intake to successful prosecution.',
    objectives: [
      'Process and analyze cybercrime complaints with precision',
      'Secure and document digital evidence following legal standards',
      'Trace complex financial transaction trails across multiple accounts',
      'Apply appropriate legal sections from IPC and IT Act',
      'Coordinate interstate operations for suspect apprehension'
    ],
    estimatedDuration: 90,
    activities: [1, 2, 3, 4, 5],
    badgeReward: {
      name: 'Financial Fraud Investigator',
      imageUrl: '/assets/badges/financial-fraud-investigator.svg',
    },
    minPassingScore: 85,
  },
];

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { 
    progress, 
    loading: progressLoading,
    statistics, 
    statisticsLoading,
    streakData,
    streakLoading,
    weakAreas,
    weakAreasLoading,
    certificationEligibility,
    certificationEligibilityLoading
  } = useSelector(state => state.progress);
  const { user } = useSelector(state => state.auth);
  const {
    activities,
    activitiesLoading,
    progressHistory,
    progressHistoryLoading
  } = useSelector(state => state.activity);

  // Fetch data when component mounts
  useEffect(() => {
    dispatch(getProgress());
    dispatch(getStatistics());
    dispatch(updateLoginStreak());
    dispatch(getWeakAreas());
    dispatch(checkCertificationEligibility());
    dispatch(getActivityHistory());
    dispatch(getProgressHistory());
  }, [dispatch]);

  // Create tabs content
  const tabsContent = [
    {
      label: 'Overview',
      content: (
        <div>
          <div className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-gray-800 mb-4">Your Progress</h2>
            <Card>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-lg font-medium text-gray-800 mb-1">Overall Completion</h3>
                  <p className="text-gray-600 mb-2">
                    You&rsquo;ve completed {mockUser.overallProgress}% of the training program
                  </p>
                </div>
                <div className="w-full md:w-1/3">
                  <ProgressBar
                    value={mockUser.overallProgress}
                    variant="police"
                    showLabel
                    size="lg"
                    animated
                  />
                </div>
              </div>
            </Card>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-gray-800 mb-4">
              Continue Your Training
            </h2>
            <Grid cols={3} smCols={1} mdCols={2}>
              {mockModules.map((module, index) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  progress={
                    mockUser.moduleProgress.find((p) => p.moduleId === module.id) || {}
                  }
                  isLocked={index > 3}
                />
              ))}
            </Grid>
          </div>

          <div>
            <h2 className="text-2xl font-heading font-bold text-gray-800 mb-4">Your Badges</h2>
            <Card>
              <div className="flex flex-wrap gap-6">
                {mockUser.badgesEarned.map((badge) => (
                  <Badge key={badge.id} imageUrl={badge.imageUrl} size="lg">
                    <div className="text-center">
                      <div className="font-medium">{badge.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{badge.description}</div>
                    </div>
                  </Badge>
                ))}
                <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-gray-500 mb-2">Next Badge</div>
                  <div className="bg-gray-200 rounded-full w-16 h-16 flex items-center justify-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div className="font-medium">Digital Defender</div>
                  <div className="text-xs text-gray-500 mt-1">Complete Module 3</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ),
    },
    {
      label: 'Modules',
      content: (
        <div>
          <h2 className="text-2xl font-heading font-bold text-gray-800 mb-4">Training Modules</h2>
          <div className="space-y-4">
            {mockModules.map((module, index) => (
              <Card key={module.id} className="hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-lg font-medium text-gray-800">{module.title}</h3>
                    <p className="text-gray-600 mb-2">{module.description}</p>
                    <div className="text-sm text-gray-500">
                      {module.estimatedDuration} min • {module.activities.length} activities
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="mb-2">
                      <Badge
                        variant={
                          mockUser.moduleProgress.find((p) => p.moduleId === module.id)?.status ===
                          'completed'
                            ? 'success'
                            : 'default'
                        }
                      >
                        {mockUser.moduleProgress.find((p) => p.moduleId === module.id)?.status ===
                        'completed'
                          ? 'Completed'
                          : mockUser.moduleProgress.find((p) => p.moduleId === module.id)?.status ===
                            'in_progress'
                          ? 'In Progress'
                          : 'Not Started'}
                      </Badge>
                    </div>
                    <Button
                      variant={index > 3 ? 'outline' : 'primary'}
                      size="sm"
                      disabled={index > 3}
                    >
                      {index > 3
                        ? 'Locked'
                        : mockUser.moduleProgress.find((p) => p.moduleId === module.id)?.status ===
                          'completed'
                        ? 'Review'
                        : 'Start'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    {
      label: 'Achievements',
      content: (
        <div>
          <h2 className="text-2xl font-heading font-bold text-gray-800 mb-4">Your Achievements</h2>
          
          {/* Badge Showcase */}
          <BadgeShowcase 
            userBadges={user?.badgesEarned?.length > 0 ? user.badgesEarned : mockUser.badgesEarned}
            className="mb-8"
          />
          
          {/* Achievement Statistics */}
          <h3 className="text-xl font-heading font-bold text-gray-800 mb-4">Achievement Statistics</h3>
          <Grid cols={3} smCols={1} mdCols={3}>
            <Card className="text-center p-4">
              <div className="text-3xl font-bold text-police-blue mb-2">
                {statistics?.badgesCount || mockUser.badgesEarned.length}
              </div>
              <div className="text-gray-600">Badges Earned</div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {statistics?.completedModules || 1}/{statistics?.totalModules || 4}
              </div>
              <div className="text-gray-600">Modules Completed</div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {statistics?.totalXP || 250}
              </div>
              <div className="text-gray-600">Total XP Earned</div>
            </Card>
          </Grid>
          
          {/* Next Achievement */}
          <h3 className="text-xl font-heading font-bold text-gray-800 mt-8 mb-4">Next Achievement</h3>
          <Card>
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/4 mb-4 md:mb-0 md:mr-6 flex justify-center">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                    <img 
                      src="/assets/badges/digital-defender.svg" 
                      alt="Digital Defender Badge" 
                      className="w-16 h-16"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/80?text=Badge";
                      }}
                    />
                  </div>
                </div>
                <div className="md:w-3/4 text-center md:text-left">
                  <h4 className="text-lg font-bold mb-2">Digital Defender</h4>
                  <p className="text-gray-600 mb-4">
                    Master time-critical response procedures for transaction freezing to earn this badge.
                    Complete Module 3 with a score of 80% or higher.
                  </p>
                  <Button 
                    to="/modules/module-3-time-critical-response" 
                    variant="primary"
                    disabled={!new BadgeService().shouldUnlockModule3({ modules: progress?.modules, badges: user?.badgesEarned })}
                  >
                    {new BadgeService().shouldUnlockModule3({ modules: progress?.modules, badges: user?.badgesEarned }) 
                      ? "Start Module 3" 
                      : "Complete Module 2 First"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
  ];

  // Create mock progress history data for demonstration
  const mockProgressHistory = [
    { label: 'Week 1', value: 10 },
    { label: 'Week 2', value: 25 },
    { label: 'Week 3', value: 40 },
    { label: 'Week 4', value: 55 },
    { label: 'Week 5', value: 70 },
    { label: 'Week 6', value: 85 },
  ];

  // Create mock activity history data for demonstration
  const mockActivities = [
    {
      type: 'module_completed',
      title: 'Module Completed',
      description: 'You completed "Introduction to Cybercrime Investigation"',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      xp: 50
    },
    {
      type: 'badge_earned',
      title: 'Badge Earned',
      description: 'You earned the "Cyber Awareness Starter" badge',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      xp: 25
    },
    {
      type: 'activity_completed',
      title: 'Activity Completed',
      description: 'You completed "Crime or Not a Crime?" quiz with a perfect score',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      xp: 30
    },
    {
      type: 'level_up',
      title: 'Level Up',
      description: 'You reached Level 2',
      timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      type: 'xp_earned',
      title: 'Daily Login Bonus',
      description: 'You earned XP for logging in 3 days in a row',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      xp: 15
    }
  ];

  // Update the Overview tab to use real data
  const overviewTab = {
    ...tabsContent[0],
    content: (
      <div>
        {/* XP Bar */}
        {statistics && (
          <div className="mb-8">
            <XPBar 
              level={statistics.level}
              progress={statistics.nextLevelProgress}
              xpForNextLevel={statistics.xpForNextLevel}
              className="mb-4"
            />
          </div>
        )}
        
        {/* Two-column layout for Login Streak and Progress Chart */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Login Streak */}
          <LoginStreak 
            streakData={streakData}
            loading={streakLoading}
          />
          
          {/* Progress Chart */}
          <ProgressChart 
            data={progressHistory || mockProgressHistory}
            loading={progressHistoryLoading}
          />
        </div>
        
        {/* Progress Summary */}
        {statistics && (
          <div className="mb-8">
            <ProgressSummary 
              statistics={statistics}
            />
          </div>
        )}
        
        {/* Two-column layout for Continue Training and Activity History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Continue Training - Takes 2/3 of the width on large screens */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-heading font-bold text-gray-800">
                Continue Your Training
              </h2>
              <div className="flex space-x-2">
                <Button 
                  to="/dialog-simulation" 
                  variant="secondary" 
                  size="sm"
                >
                  Try Dialog Simulation
                </Button>
                <Button 
                  to="/timer-demo" 
                  variant="secondary" 
                  size="sm"
                >
                  Timer Components Demo
                </Button>
                <Button 
                  to="/modules/module-3-time-critical-response" 
                  variant="secondary" 
                  size="sm"
                >
                  Transaction Freeze
                </Button>
              </div>
            </div>
            <Grid cols={2} smCols={1} mdCols={2}>
              {mockModules.map((module, index) => (
                <ModuleCard
                  key={module.id}
                  module={module}
                  progress={progress || { modules: mockUser.moduleProgress }}
                  userBadges={user?.badgesEarned || mockUser.badgesEarned}
                />
              ))}
            </Grid>
          </div>
          
          {/* Activity History - Takes 1/3 of the width on large screens */}
          <div>
            <ActivityHistory 
              activities={activities || mockActivities}
              loading={activitiesLoading}
            />
          </div>
        </div>
        
        {/* Two-column layout for Badges and Certification Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Badges */}
          <div>
            <h2 className="text-2xl font-heading font-bold text-gray-800 mb-4">Your Badges</h2>
            <BadgeShowcase 
              userBadges={user?.badgesEarned?.length > 0 ? user.badgesEarned : mockUser.badgesEarned}
            />
          </div>
          
          {/* Certification Progress */}
          <CertificationProgress 
            eligibility={certificationEligibility}
            loading={certificationEligibilityLoading}
          />
        </div>
        
        {/* Featured Simulation */}
        <div className="mb-8">
          <h2 className="text-2xl font-heading font-bold text-gray-800 mb-4">Featured Training Simulation</h2>
          <Card>
            <div className="p-6">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/4 mb-4 md:mb-0 md:mr-6">
                  <img 
                    src="/assets/characters/victim-male-1.png" 
                    alt="Dialog Simulation" 
                    className="rounded-lg shadow-md w-full"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/200x150?text=Dialog+Simulation";
                    }}
                  />
                </div>
                <div className="md:w-3/4">
                  <h3 className="text-xl font-bold mb-2">Victim Interview Simulation</h3>
                  <p className="text-gray-600 mb-4">
                    Practice your communication skills with cybercrime victims in this interactive dialog simulation. 
                    Learn how to gather information with empathy and professionalism while being scored on your 
                    communication quality.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">Communication Skills</Badge>
                    <Badge variant="secondary">Victim Support</Badge>
                    <Badge variant="secondary">Information Gathering</Badge>
                  </div>
                  <Button 
                    to="/dialog-simulation" 
                    variant="primary"
                  >
                    Start Simulation
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Weak Areas */}
        {weakAreas && weakAreas.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-gray-800 mb-4">Areas to Improve</h2>
            <Card>
              <div className="p-4">
                {weakAreas.map((area, index) => (
                  <div key={index} className="mb-4 last:mb-0">
                    <h3 className="font-medium text-gray-900 mb-2">{area.details}</h3>
                    <p className="text-gray-600">{area.recommendation}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    )
  };
  
  // Update tabs with real data
  const updatedTabs = [
    overviewTab,
    tabsContent[1],
    tabsContent[2]
  ];

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name || mockUser.name}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button to="/modules">Continue Training</Button>
          </div>
        </div>
      </div>

      <Tabs tabs={updatedTabs} variant="underline" />
      <GamificationNotification />
    </Layout>
  );
};

export default DashboardPage;