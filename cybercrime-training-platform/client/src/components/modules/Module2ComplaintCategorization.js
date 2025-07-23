import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Badge, ProgressBar } from '../ui';
import VictimDialogSimulation from './activities/VictimDialogSimulation';
import ComplaintCategorizationActivity from './activities/ComplaintCategorizationActivity';
import NCRPFormCompletion from './activities/NCRPFormCompletion';
import ModuleCompletion from './ModuleCompletion';
import { updateActivityProgress } from '../../store/actions/progressActions';
import { module2Data } from '../../data/module2Data';

/**
 * Module 2: Complaint Categorization and Intake
 * Main component for handling Module 2 training activities
 */
const Module2ComplaintCategorization = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { progress } = useSelector(state => state.progress);
  
  const [currentActivity, setCurrentActivity] = useState(0);
  const [activityScores, setActivityScores] = useState({});
  const [moduleCompleted, setModuleCompleted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [earnedBadge, setEarnedBadge] = useState(null);

  // Initialize module start time
  useEffect(() => {
    if (!startTime) {
      setStartTime(new Date());
    }
  }, [startTime]);

  // Check if module is already completed
  useEffect(() => {
    if (progress?.modules) {
      const moduleProgress = progress.modules.find(m => m.moduleId === module2Data.id);
      if (moduleProgress?.status === 'completed') {
        setModuleCompleted(true);
        // Restore activity scores
        const scores = {};
        moduleProgress.activitiesCompleted.forEach(activity => {
          scores[activity.activityId] = activity.score;
        });
        setActivityScores(scores);
      }
    }
  }, [progress]);

  // Handle activity completion
  const handleActivityComplete = async (activityId, score, responses) => {
    try {
      // Update local state
      setActivityScores(prev => ({
        ...prev,
        [activityId]: score
      }));

      // Update progress in backend
      await dispatch(updateActivityProgress(
        user.id,
        module2Data.id,
        activityId,
        {
          status: 'completed',
          score: score,
          userResponses: responses,
          completedAt: new Date()
        }
      ));

      // Check if all activities are completed
      const totalActivities = module2Data.activities.length;
      const completedActivities = Object.keys({ ...activityScores, [activityId]: score }).length;
      
      if (completedActivities === totalActivities) {
        // Calculate final score
        const totalScore = Object.values({ ...activityScores, [activityId]: score })
          .reduce((sum, score) => sum + score, 0);
        const finalScore = Math.round(totalScore / totalActivities);
        
        // Calculate time spent
        const timeSpent = startTime ? Math.floor((new Date() - startTime) / 1000) : 0;
        
        // Complete the module
        const moduleResult = await dispatch(updateActivityProgress(
          user.id,
          module2Data.id,
          'module-completion',
          {
            status: 'completed',
            score: finalScore,
            timeSpent: timeSpent,
            completedAt: new Date()
          }
        ));

        // Check for badge award
        if (moduleResult.badge) {
          setEarnedBadge(moduleResult.badge);
        }

        setModuleCompleted(true);
      } else {
        // Move to next activity
        setCurrentActivity(prev => Math.min(prev + 1, totalActivities - 1));
      }
    } catch (error) {
      console.error('Error completing activity:', error);
    }
  };

  // Handle activity navigation
  const handleActivityNavigation = (activityIndex) => {
    setCurrentActivity(activityIndex);
  };

  // Calculate overall progress
  const calculateProgress = () => {
    const completedActivities = Object.keys(activityScores).length;
    const totalActivities = module2Data.activities.length;
    return Math.round((completedActivities / totalActivities) * 100);
  };

  // Calculate current score
  const calculateCurrentScore = () => {
    const scores = Object.values(activityScores);
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  // Render activity component
  const renderCurrentActivity = () => {
    const activity = module2Data.activities[currentActivity];
    const isCompleted = activityScores.hasOwnProperty(activity.id);
    
    switch (activity.id) {
      case 'victim-dialog-simulation':
        return (
          <VictimDialogSimulation
            activity={activity}
            onComplete={(score, responses) => handleActivityComplete(activity.id, score, responses)}
            isCompleted={isCompleted}
            previousScore={activityScores[activity.id]}
          />
        );
      case 'complaint-categorization':
        return (
          <ComplaintCategorizationActivity
            activity={activity}
            onComplete={(score, responses) => handleActivityComplete(activity.id, score, responses)}
            isCompleted={isCompleted}
            previousScore={activityScores[activity.id]}
          />
        );
      case 'ncrp-form-completion':
        return (
          <NCRPFormCompletion
            activity={activity}
            onComplete={(score, responses) => handleActivityComplete(activity.id, score, responses)}
            isCompleted={isCompleted}
            previousScore={activityScores[activity.id]}
          />
        );
      default:
        return <div>Activity not found</div>;
    }
  };

  // Show completion screen if module is completed
  if (moduleCompleted) {
    const moduleProgress = progress?.modules?.find(m => m.moduleId === module2Data.id);
    return (
      <ModuleCompletion
        module={module2Data}
        progress={moduleProgress}
        badge={earnedBadge}
        xp={{ earned: earnedBadge ? 150 : 0 }}
        onContinue={() => {
          // Navigate to next module or dashboard
          window.location.href = '/dashboard';
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Module Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{module2Data.title}</h1>
              <p className="text-gray-600 mt-2">{module2Data.description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="info">Module 2</Badge>
              <Badge variant={calculateCurrentScore() >= 80 ? 'success' : 'warning'}>
                Score: {calculateCurrentScore()}%
              </Badge>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm text-gray-500">{calculateProgress()}% Complete</span>
            </div>
            <ProgressBar progress={calculateProgress()} className="h-2" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Activity Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Activities</h3>
                <nav className="space-y-2">
                  {module2Data.activities.map((activity, index) => {
                    const isCompleted = activityScores.hasOwnProperty(activity.id);
                    const isCurrent = index === currentActivity;
                    const isAccessible = index <= currentActivity || isCompleted;
                    
                    return (
                      <button
                        key={activity.id}
                        onClick={() => isAccessible && handleActivityNavigation(index)}
                        disabled={!isAccessible}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isCurrent
                            ? 'bg-police-blue text-white'
                            : isCompleted
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : isAccessible
                            ? 'text-gray-700 hover:bg-gray-100'
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{activity.title}</span>
                          {isCompleted && (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        {isCompleted && (
                          <div className="text-xs mt-1 opacity-75">
                            Score: {activityScores[activity.id]}%
                          </div>
                        )}
                      </button>
                    );
                  })}
                </nav>
                
                {/* Module Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-600 space-y-2">
                    <div>
                      <span className="font-medium">Duration:</span> {module2Data.estimatedDuration} min
                    </div>
                    <div>
                      <span className="font-medium">Difficulty:</span> {module2Data.difficulty}
                    </div>
                    <div>
                      <span className="font-medium">Passing Score:</span> {module2Data.minPassingScore}%
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Activity Content */}
          <div className="lg:col-span-3">
            {renderCurrentActivity()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Module2ComplaintCategorization;