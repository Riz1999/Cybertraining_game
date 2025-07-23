/**
 * Module 4 Test Script
 * 
 * This script tests the Module 4: Escalation to FIR and CCTNS implementation,
 * specifically the complaint delay scenario system.
 */

// Import the necessary modules
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from '../store/configureStore';
import ModuleDetailPage from '../pages/ModuleDetailPage';
import ComplaintDelayScenarioModule from '../components/modules/ComplaintDelayScenarioModule';

// Create a mock store
const store = configureStore();

// Mock the useParams hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    moduleId: 'module-4-escalation-fir'
  })
}));

describe('Module 4: Escalation to FIR and CCTNS', () => {
  // Test the ModuleDetailPage with Module 4
  test('ModuleDetailPage renders Module 4 correctly', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ModuleDetailPage />
        </BrowserRouter>
      </Provider>
    );
    
    // Check that the module title is rendered
    expect(screen.getByText('Escalation to FIR and CCTNS')).toBeInTheDocument();
    
    // Check that the module description is rendered
    expect(screen.getByText('Learn when and how to escalate cybercrime complaints to formal FIRs and file them in the CCTNS system')).toBeInTheDocument();
  });
  
  // Test the ComplaintDelayScenarioModule component
  test('ComplaintDelayScenarioModule renders correctly', () => {
    const mockActivity = {
      id: 'complaint-delay-scenario',
      type: 'simulation',
      title: 'Complaint Delay Scenario',
      description: 'Practice handling cases where complaints have been delayed in processing',
      content: {
        type: 'complaint_delay',
        scenarios: [
          {
            id: 'financial-fraud-delay',
            title: 'UPI Fraud Case Escalation',
            complexity: 'medium',
            caseType: 'financial',
            timeSpan: 14
          }
        ]
      }
    };
    
    const handleComplete = jest.fn();
    
    render(
      <Provider store={store}>
        <ComplaintDelayScenarioModule
          activity={mockActivity}
          onComplete={handleComplete}
        />
      </Provider>
    );
    
    // Check that the intro screen is rendered
    expect(screen.getByText('Complaint Delay Scenario')).toBeInTheDocument();
    
    // Check that the start button is rendered
    expect(screen.getByText('Start Simulation')).toBeInTheDocument();
    
    // Click the start button
    fireEvent.click(screen.getByText('Start Simulation'));
    
    // Check that the simulation is rendered
    expect(screen.getByText('Case Timeline')).toBeInTheDocument();
  });
});

// Run the tests
console.log('Running tests for Module 4: Escalation to FIR and CCTNS...');
// In a real environment, these tests would be run with Jest
// For this demo, we're just logging the test structure