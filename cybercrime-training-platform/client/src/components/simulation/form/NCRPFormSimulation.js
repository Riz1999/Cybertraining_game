import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormSimulationContainer from './FormSimulationContainer';

/**
 * NCRPFormSimulation component
 * 
 * This component provides a specialized simulation for NCRP (National Cyber Crime Reporting Portal) forms.
 * It includes realistic form fields and validation specific to cybercrime reporting.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.scenario - The cybercrime scenario
 * @param {Function} props.onComplete - Callback when simulation is complete
 * @param {Object} props.userProfile - The user profile data
 */
const NCRPFormSimulation = ({
  scenario = {
    victim: {
      name: 'Rajesh Kumar',
      phone: '+91-9876543210',
      email: 'rajesh.kumar@email.com',
      address: 'Flat 204, Green Valley Apartments, Sector 15, Noida, UP - 201301'
    },
    incident: {
      date: '2024-01-15',
      time: '14:30',
      category: 'Financial Fraud',
      description: 'Received fraudulent call claiming to be from bank. Caller asked for OTP and transferred ₹50,000 from my account.'
    },
    suspect: {
      phone: '+91-8765432109',
      account: '1234567890123456'
    },
    evidence: {
      transactionId: 'UTR123456789012',
      amount: '50000',
      bankName: 'State Bank of India'
    },
    description: 'A victim has approached you to file a cybercrime complaint. Use the information provided to complete the NCRP form accurately.'
  },
  onComplete,
  userProfile
}) => {
  const [simulationData, setSimulationData] = useState(null);

  useEffect(() => {
    // Create NCRP form template based on the scenario
    const formTemplate = {
      title: 'National Cyber Crime Reporting Portal - Complaint Registration',
      sections: [
        {
          id: 'complainant',
          title: 'Complainant Details'
        },
        {
          id: 'incident',
          title: 'Incident Details'
        },
        {
          id: 'suspect',
          title: 'Suspect Information'
        },
        {
          id: 'evidence',
          title: 'Evidence & Transaction Details'
        }
      ],
      fields: [
        // Complainant Details
        {
          id: 'complainant_name',
          label: 'Complainant Name',
          type: 'text',
          sectionId: 'complainant',
          isRequired: true,
          correctValue: scenario.victim?.name || 'Rajesh Kumar'
        },
        {
          id: 'complainant_phone',
          label: 'Mobile Number',
          type: 'tel',
          sectionId: 'complainant',
          isRequired: true,
          correctValue: scenario.victim?.phone || '+91-9876543210'
        },
        {
          id: 'complainant_email',
          label: 'Email Address',
          type: 'email',
          sectionId: 'complainant',
          isRequired: true,
          correctValue: scenario.victim?.email || 'rajesh.kumar@email.com'
        },
        {
          id: 'complainant_address',
          label: 'Address',
          type: 'textarea',
          sectionId: 'complainant',
          isRequired: true,
          correctValue: scenario.victim?.address || 'Flat 204, Green Valley Apartments, Sector 15, Noida, UP - 201301'
        },
        
        // Incident Details
        {
          id: 'incident_date',
          label: 'Date of Incident',
          type: 'date',
          sectionId: 'incident',
          isRequired: true,
          correctValue: scenario.incident?.date || '2024-01-15'
        },
        {
          id: 'incident_time',
          label: 'Time of Incident',
          type: 'time',
          sectionId: 'incident',
          isRequired: true,
          correctValue: scenario.incident?.time || '14:30'
        },
        {
          id: 'incident_category',
          label: 'Category of Cybercrime',
          type: 'select',
          sectionId: 'incident',
          isRequired: true,
          correctValue: scenario.incident?.category || 'Financial Fraud'
        },
        {
          id: 'incident_description',
          label: 'Incident Description',
          type: 'textarea',
          sectionId: 'incident',
          isRequired: true,
          correctValue: scenario.incident?.description || 'Received fraudulent call claiming to be from bank. Caller asked for OTP and transferred ₹50,000 from my account.'
        },
        
        // Suspect Information
        {
          id: 'suspect_phone',
          label: 'Suspect Phone Number',
          type: 'tel',
          sectionId: 'suspect',
          isRequired: false,
          correctValue: scenario.suspect?.phone || '+91-8765432109'
        },
        {
          id: 'suspect_account',
          label: 'Suspect Bank Account',
          type: 'text',
          sectionId: 'suspect',
          isRequired: false,
          correctValue: scenario.suspect?.account || '1234567890123456'
        },
        
        // Evidence & Transaction Details
        {
          id: 'transaction_id',
          label: 'Transaction ID/UTR',
          type: 'text',
          sectionId: 'evidence',
          isRequired: true,
          correctValue: scenario.evidence?.transactionId || 'UTR123456789012'
        },
        {
          id: 'amount_lost',
          label: 'Amount Lost (₹)',
          type: 'number',
          sectionId: 'evidence',
          isRequired: true,
          correctValue: scenario.evidence?.amount || '50000'
        },
        {
          id: 'bank_name',
          label: 'Bank Name',
          type: 'text',
          sectionId: 'evidence',
          isRequired: true,
          correctValue: scenario.evidence?.bankName || 'State Bank of India'
        }
      ]
    };

    // Create drag items based on scenario
    const dragItems = [
      {
        id: 'item_1',
        label: 'Victim Name',
        value: scenario.victim?.name || 'Rajesh Kumar',
        category: 'Personal'
      },
      {
        id: 'item_2',
        label: 'Phone Number',
        value: scenario.victim?.phone || '+91-9876543210',
        category: 'Contact'
      },
      {
        id: 'item_3',
        label: 'Email Address',
        value: scenario.victim?.email || 'rajesh.kumar@email.com',
        category: 'Contact'
      },
      {
        id: 'item_4',
        label: 'Home Address',
        value: scenario.victim?.address || 'Flat 204, Green Valley Apartments, Sector 15, Noida, UP - 201301',
        category: 'Personal'
      },
      {
        id: 'item_5',
        label: 'Incident Date',
        value: scenario.incident?.date || '2024-01-15',
        category: 'Incident'
      },
      {
        id: 'item_6',
        label: 'Incident Time',
        value: scenario.incident?.time || '14:30',
        category: 'Incident'
      },
      {
        id: 'item_7',
        label: 'Crime Category',
        value: scenario.incident?.category || 'Financial Fraud',
        category: 'Classification'
      },
      {
        id: 'item_8',
        label: 'Incident Details',
        value: scenario.incident?.description || 'Received fraudulent call claiming to be from bank. Caller asked for OTP and transferred ₹50,000 from my account.',
        category: 'Incident'
      },
      {
        id: 'item_9',
        label: 'Suspect Phone',
        value: scenario.suspect?.phone || '+91-8765432109',
        category: 'Suspect'
      },
      {
        id: 'item_10',
        label: 'Suspect Account',
        value: scenario.suspect?.account || '1234567890123456',
        category: 'Suspect'
      },
      {
        id: 'item_11',
        label: 'Transaction ID',
        value: scenario.evidence?.transactionId || 'UTR123456789012',
        category: 'Evidence'
      },
      {
        id: 'item_12',
        label: 'Amount Lost',
        value: scenario.evidence?.amount || '50000',
        category: 'Financial'
      },
      {
        id: 'item_13',
        label: 'Bank Name',
        value: scenario.evidence?.bankName || 'State Bank of India',
        category: 'Financial'
      }
    ];

    setSimulationData({
      type: 'form',
      formTemplate,
      dragItems,
      scenario: {
        title: 'Cybercrime Complaint Registration',
        description: scenario.description || 'A victim has approached you to file a cybercrime complaint. Use the information provided to complete the NCRP form accurately.'
      }
    });
  }, [scenario]);

  const handleComplete = (results) => {
    // Enhanced scoring for NCRP form
    const { accuracy, timeSpent, correctCount, totalFields } = results;
    
    // Calculate detailed scoring
    const accuracyScore = accuracy * 40; // 40% for accuracy
    const speedScore = Math.max(0, 30 - (timeSpent / 60) * 2); // 30% for speed (penalty after 15 minutes)
    const completionScore = (correctCount / totalFields) * 30; // 30% for completion
    
    const finalScore = Math.min(100, accuracyScore + speedScore + completionScore);
    
    // Determine performance level
    let performanceLevel = 'Poor';
    let feedback = 'Needs significant improvement in form completion accuracy and speed.';
    
    if (finalScore >= 90) {
      performanceLevel = 'Excellent';
      feedback = 'Outstanding performance! You have demonstrated excellent skills in NCRP form completion.';
    } else if (finalScore >= 75) {
      performanceLevel = 'Good';
      feedback = 'Good performance! Minor improvements needed in accuracy or speed.';
    } else if (finalScore >= 60) {
      performanceLevel = 'Average';
      feedback = 'Average performance. Focus on improving accuracy and reducing completion time.';
    }

    // Call the original onComplete with enhanced results
    if (onComplete) {
      onComplete({
        ...results,
        finalScore: Math.round(finalScore),
        performanceLevel,
        feedback,
        detailedScoring: {
          accuracy: Math.round(accuracyScore),
          speed: Math.round(speedScore),
          completion: Math.round(completionScore)
        }
      });
    }
  };

  if (!simulationData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Preparing NCRP form simulation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ncrp-form-simulation">
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-xl font-bold text-blue-900 mb-2">
          NCRP Form Completion Exercise
        </h2>
        <p className="text-blue-800 text-sm">
          Complete the National Cyber Crime Reporting Portal form using the victim information provided. 
          Drag the correct information from the panel on the right to the appropriate form fields.
        </p>
        <div className="mt-3 flex items-center text-sm text-blue-700">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Accuracy and speed will be evaluated for your final score.
        </div>
      </div>
      
      <FormSimulationContainer
        simulationData={simulationData}
        userProfile={userProfile}
        onComplete={handleComplete}
      />
    </div>
  );
};

NCRPFormSimulation.propTypes = {
  scenario: PropTypes.shape({
    victim: PropTypes.object,
    incident: PropTypes.object,
    suspect: PropTypes.object,
    evidence: PropTypes.object,
    description: PropTypes.string
  }),
  onComplete: PropTypes.func,
  userProfile: PropTypes.object
};

export default NCRPFormSimulation;