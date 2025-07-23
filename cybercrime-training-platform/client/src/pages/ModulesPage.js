import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/layout/Layout';
import { ModuleNavigation, ModuleUnlockNotification } from '../components/modules';
import { getAvailableModules, clearModuleUnlockNotification } from '../store/actions/moduleActions';

/**
 * Modules Page component for displaying all available modules
 * @returns {React.ReactElement} Modules Page component
 */
const ModulesPage = () => {
  const dispatch = useDispatch();
  const { 
    availableModules, 
    availableModulesLoading, 
    unlockedModule 
  } = useSelector(state => state.modules);
  const { progress } = useSelector(state => state.progress);
  const { user } = useSelector(state => state.auth);

  // Fetch available modules when component mounts
  useEffect(() => {
    // Skip API calls for now to avoid 404 errors - using mock data instead
    console.log('Using mock data for modules');
  }, [dispatch]);

  // Handle module unlock notification close
  const handleUnlockNotificationClose = () => {
    dispatch(clearModuleUnlockNotification());
  };

  // Mock modules data to show components immediately
  const mockModules = [
    {
      id: 'module-1-intro-cybercrime',
      title: 'Introduction to Cybercrime Investigation',
      description: 'Learn about different types of cybercrimes and national systems',
      estimatedDuration: 60,
      activities: [
        { id: 'activity_1_1', type: 'interactive', title: 'Officer Avatar Onboarding' },
        { id: 'activity_1_2', type: 'quiz', title: 'Crime or Not a Crime?' },
        { id: 'activity_1_3', type: 'interactive', title: 'System Map Exploration' }
      ],
      badgeReward: {
        name: 'Cyber Awareness Starter',
        imageUrl: '/assets/badges/cyber-awareness-starter.svg'
      },
      isAvailable: true,
      status: 'not_started'
    },
    {
      id: 'module-2-complaint-categorization',
      title: 'Complaint Categorization and Intake',
      description: 'Learn how to categorize cybercrime complaints and collect accurate information',
      estimatedDuration: 90,
      activities: [
        { id: 'activity_2_1', type: 'simulation', title: 'Victim Dialog Scenario' },
        { id: 'activity_2_2', type: 'categorization', title: 'Complaint Categorization Training' },
        { id: 'activity_2_3', type: 'form', title: 'NCRP Form Completion' }
      ],
      badgeReward: {
        name: 'First Responder',
        imageUrl: '/assets/badges/first-responder.svg'
      },
      isAvailable: true,
      status: 'not_started'
    },
    {
      id: 'module-3-time-critical-response',
      title: 'Time-Critical Response: Transaction Freezing',
      description: 'Practice time-bound responses to fraudulent transactions',
      estimatedDuration: 45,
      activities: [
        { id: 'transaction-freeze-simulation', type: 'time-critical', title: 'Transaction Freeze Simulation' },
        { id: 'bank-coordination', type: 'coordination', title: 'Multi-Bank Coordination' },
        { id: 'legal-compliance', type: 'documentation', title: 'Legal Compliance and Documentation' }
      ],
      badgeReward: {
        name: 'Digital Defender',
        imageUrl: '/assets/badges/digital-defender.svg'
      },
      isAvailable: true,
      status: 'not_started',
      prerequisites: []
    },
    {
      id: 'module-4-escalation-fir',
      title: 'Escalation to FIR and CCTNS',
      description: 'Learn when and how to escalate cybercrime complaints to formal FIRs and file them in the CCTNS system',
      estimatedDuration: 60,
      activities: [
        { id: 'complaint-delay-scenario', type: 'simulation', title: 'Complaint Delay Scenario' },
        { id: 'fir-documentation', type: 'documentation', title: 'FIR Documentation Requirements' },
        { id: 'cctns-filing', type: 'system', title: 'CCTNS Filing Procedure' }
      ],
      badgeReward: {
        name: 'FIR Specialist',
        imageUrl: '/assets/badges/fir-specialist.svg'
      },
      isAvailable: true,
      status: 'not_started',
      prerequisites: ['module-3-time-critical-response']
    },
    {
      id: 'module-5-financial-fraud-investigation',
      title: 'Financial Fraud Investigation',
      description: 'Master the end-to-end investigation process for financial fraud cases, from complaint intake to successful prosecution',
      estimatedDuration: 90,
      activities: [
        { id: 'complaint-analysis', type: 'interactive', title: 'Complaint Analysis and Jurisdiction' },
        { id: 'evidence-collection', type: 'interactive', title: 'First Response and Evidence Collection' },
        { id: 'transaction-tracing', type: 'interactive', title: 'Tracing the Transaction Trail' },
        { id: 'legal-case-building', type: 'interactive', title: 'Building the Legal Case' },
        { id: 'arrest-prosecution', type: 'interactive', title: 'Arrest and Prosecution' }
      ],
      badgeReward: {
        name: 'Financial Fraud Investigator',
        imageUrl: '/assets/badges/financial-fraud-investigator.svg'
      },
      isAvailable: true, // Always available for now
      status: 'not_started',
      prerequisites: [] // Removed prerequisites to make it always available
    }
  ];

  // Use mock data if no modules are available from API
  const displayModules = availableModules.length > 0 ? availableModules : mockModules;

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900">Training Modules</h1>
            <p className="text-gray-600">
              Complete modules to earn badges and improve your cybercrime investigation skills
            </p>
          </div>
        </div>
      </div>

      {availableModulesLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-police-blue"></div>
        </div>
      ) : (
        <ModuleNavigation 
          modules={displayModules} 
          userProgress={progress}
          userXP={user?.totalXP || 0}
        />
      )}

      {/* Module unlock notification */}
      <ModuleUnlockNotification 
        module={unlockedModule} 
        onClose={handleUnlockNotificationClose} 
      />
    </Layout>
  );
};

export default ModulesPage;