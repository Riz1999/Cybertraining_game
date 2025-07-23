import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import FormSimulationContainer from './FormSimulationContainer';
import NCRPFormSimulation from './NCRPFormSimulation';
import { validateField, validateForm, calculateAccuracy } from './FormValidation';
import { calculateFormScore } from './FormScoring';

// Mock data for testing
const mockSimulationData = {
  type: 'form',
  formTemplate: {
    title: 'Test Form',
    sections: [
      {
        id: 'section1',
        title: 'Test Section'
      }
    ],
    fields: [
      {
        id: 'field1',
        label: 'Test Field',
        type: 'text',
        sectionId: 'section1',
        isRequired: true,
        correctValue: 'correct answer'
      },
      {
        id: 'field2',
        label: 'Email Field',
        type: 'email',
        sectionId: 'section1',
        isRequired: true,
        correctValue: 'test@example.com'
      }
    ]
  },
  dragItems: [
    {
      id: 'item1',
      label: 'Test Item',
      value: 'correct answer',
      category: 'Test'
    },
    {
      id: 'item2',
      label: 'Email Item',
      value: 'test@example.com',
      category: 'Contact'
    }
  ],
  scenario: {
    title: 'Test Scenario',
    description: 'This is a test scenario'
  }
};

const mockScenario = {
  victim: {
    name: 'Test User',
    phone: '+91-9876543210',
    email: 'test@example.com',
    address: 'Test Address'
  },
  incident: {
    date: '2024-01-15',
    time: '14:30',
    category: 'Financial Fraud',
    description: 'Test incident description'
  },
  suspect: {
    phone: '+91-8765432109',
    account: '1234567890123456'
  },
  evidence: {
    transactionId: 'UTR123456789012',
    amount: '50000',
    bankName: 'Test Bank'
  }
};

describe('Form Simulation Components', () => {
  describe('FormSimulationContainer', () => {
    test('renders form simulation container', () => {
      render(
        <FormSimulationContainer
          simulationData={mockSimulationData}
          onComplete={jest.fn()}
        />
      );

      expect(screen.getByText('Test Form')).toBeInTheDocument();
      expect(screen.getByText('Test Field')).toBeInTheDocument();
      expect(screen.getByText('Victim Information')).toBeInTheDocument();
    });

    test('displays error state when no simulation data', () => {
      render(
        <FormSimulationContainer
          simulationData={null}
          onComplete={jest.fn()}
        />
      );

      expect(screen.getByText('No simulation data provided')).toBeInTheDocument();
    });

    test('shows validation errors on empty form submission', async () => {
      const onComplete = jest.fn();
      
      render(
        <FormSimulationContainer
          simulationData={mockSimulationData}
          onComplete={onComplete}
        />
      );

      const submitButton = screen.getByText('Submit Form');
      fireEvent.click(submitButton);

      // Should show validation errors instead of calling onComplete
      expect(screen.getByText('Test Field is required')).toBeInTheDocument();
      expect(screen.getByText('Email Field is required')).toBeInTheDocument();
      expect(onComplete).not.toHaveBeenCalled();
    });
  });

  describe('NCRPFormSimulation', () => {
    test('renders NCRP form simulation', () => {
      render(
        <NCRPFormSimulation
          scenario={mockScenario}
          onComplete={jest.fn()}
        />
      );

      expect(screen.getByText('NCRP Form Completion Exercise')).toBeInTheDocument();
      expect(screen.getByText(/Complete the National Cyber Crime Reporting Portal form/)).toBeInTheDocument();
    });

    test('generates correct form template from scenario', async () => {
      render(
        <NCRPFormSimulation
          scenario={mockScenario}
          onComplete={jest.fn()}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Complainant Name')).toBeInTheDocument();
        expect(screen.getByText('Mobile Number')).toBeInTheDocument();
        expect(screen.getAllByText('Email Address')).toHaveLength(2); // One in form, one in drag items
        expect(screen.getByText('Transaction ID/UTR')).toBeInTheDocument();
      });
    });
  });

  describe('Form Validation', () => {
    test('validates required fields', () => {
      const field = {
        id: 'test',
        label: 'Test Field',
        type: 'text',
        isRequired: true
      };

      const result = validateField(field, '');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Test Field is required');
    });

    test('validates email format', () => {
      const field = {
        id: 'email',
        label: 'Email',
        type: 'email',
        isRequired: true
      };

      const invalidResult = validateField(field, 'invalid-email');
      expect(invalidResult.isValid).toBe(false);
      expect(invalidResult.error).toBe('Please enter a valid email address');

      const validResult = validateField(field, 'test@example.com');
      expect(validResult.isValid).toBe(true);
      expect(validResult.error).toBe(null);
    });

    test('validates phone number format', () => {
      const field = {
        id: 'phone',
        label: 'Phone',
        type: 'tel',
        isRequired: true
      };

      const invalidResult = validateField(field, '123');
      expect(invalidResult.isValid).toBe(false);

      const validResult = validateField(field, '+91-9876543210');
      expect(validResult.isValid).toBe(true);
    });

    test('validates entire form', () => {
      const formTemplate = {
        fields: [
          {
            id: 'field1',
            label: 'Field 1',
            type: 'text',
            isRequired: true
          },
          {
            id: 'field2',
            label: 'Field 2',
            type: 'email',
            isRequired: true
          }
        ]
      };

      const formState = {
        field1: { value: 'test', isFilled: true },
        field2: { value: 'invalid-email', isFilled: true }
      };

      const result = validateForm(formTemplate, formState);
      expect(result.isValid).toBe(false);
      expect(result.errors.field2).toBe('Please enter a valid email address');
    });

    test('calculates accuracy correctly', () => {
      const formTemplate = {
        fields: [
          {
            id: 'field1',
            correctValue: 'correct1'
          },
          {
            id: 'field2',
            correctValue: 'correct2'
          }
        ]
      };

      const formState = {
        field1: { value: 'correct1', isFilled: true },
        field2: { value: 'wrong', isFilled: true }
      };

      const result = calculateAccuracy(formTemplate, formState);
      expect(result.accuracy).toBe(0.5);
      expect(result.correctCount).toBe(1);
      expect(result.totalCount).toBe(2);
    });
  });

  describe('Form Scoring', () => {
    test('calculates form score correctly', () => {
      const result = calculateFormScore({
        accuracy: 0.8,
        completionPercentage: 90,
        timeSpent: 180,
        formTemplate: { fields: [1, 2, 3, 4, 5] }
      });

      expect(result.totalScore).toBeGreaterThan(0);
      expect(result.totalScore).toBeLessThanOrEqual(100);
      expect(result.performanceLevel).toBeDefined();
      expect(result.feedback).toBeDefined();
    });

    test('assigns correct performance levels', () => {
      const excellentScore = calculateFormScore({
        accuracy: 1.0,
        completionPercentage: 100,
        timeSpent: 120,
        formTemplate: { fields: [1, 2, 3] }
      });

      expect(excellentScore.performanceLevel).toBe('Excellent');

      const poorScore = calculateFormScore({
        accuracy: 0.3,
        completionPercentage: 50,
        timeSpent: 600,
        formTemplate: { fields: [1, 2, 3] }
      });

      expect(['Poor', 'Needs Improvement']).toContain(poorScore.performanceLevel);
    });
  });
});

describe('Integration Tests', () => {
  test('form validation prevents submission with empty fields', async () => {
    const onComplete = jest.fn();
    
    render(
      <FormSimulationContainer
        simulationData={mockSimulationData}
        onComplete={onComplete}
      />
    );

    // Try to submit empty form
    const submitButton = screen.getByText('Submit Form');
    fireEvent.click(submitButton);

    // Should show validation errors and not call onComplete
    await waitFor(() => {
      expect(screen.getByText('Test Field is required')).toBeInTheDocument();
      expect(screen.getByText('Email Field is required')).toBeInTheDocument();
    });
    
    expect(onComplete).not.toHaveBeenCalled();
  });
});