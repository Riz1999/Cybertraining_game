import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormRenderer from './FormRenderer';
import DraggableInfoPanel from './DraggableInfoPanel';
import { validateForm, calculateCompletionPercentage, calculateAccuracy } from './FormValidation';
import { calculateFormScore } from './FormScoring';
import { SIMULATION_TYPES } from '../../../simulation/models/SimulationTypes';

/**
 * FormSimulationContainer component
 * 
 * This component serves as the main container for form simulations,
 * providing the drag-and-drop interface for completing forms.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.simulationData - The simulation data
 * @param {Object} props.userProfile - The user profile data
 * @param {Function} props.onComplete - Callback when simulation is complete
 */
const FormSimulationContainer = ({
  simulationData,
  userProfile,
  onComplete
}) => {
  const [formState, setFormState] = useState({});
  const [dragItems, setDragItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [startTime, setStartTime] = useState(null);

  // Initialize the form simulation
  useEffect(() => {
    if (!simulationData) {
      setIsLoading(false);
      return;
    }

    try {
      // Initialize form state with empty values
      const initialState = {};
      const formFields = simulationData.formTemplate.fields || [];
      
      formFields.forEach(field => {
        initialState[field.id] = {
          value: '',
          isRequired: field.isRequired || false,
          isValid: false,
          isFilled: false
        };
      });
      
      setFormState(initialState);
      setDragItems(simulationData.dragItems || []);
      setStartTime(new Date());
      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing form simulation:', error);
      setIsLoading(false);
    }
  }, [simulationData]);

  // Handle dropping an item into a form field
  const handleDrop = (fieldId, itemId) => {
    const item = dragItems.find(item => item.id === itemId);
    
    if (!item) return;
    
    // Update form state
    setFormState(prevState => ({
      ...prevState,
      [fieldId]: {
        ...prevState[fieldId],
        value: item.value,
        isFilled: true,
        isValid: true
      }
    }));
    
    // Remove item from available drag items
    setDragItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate form using the validation system
    const validation = validateForm(simulationData.formTemplate, formState);
    
    setErrors(validation.errors);
    
    if (!validation.isValid) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Calculate metrics
    const endTime = new Date();
    const timeSpent = (endTime - startTime) / 1000; // in seconds
    const completionPercentage = calculateCompletionPercentage(simulationData.formTemplate, formState);
    const accuracyData = calculateAccuracy(simulationData.formTemplate, formState);
    
    // Calculate comprehensive score using the scoring system
    const scoreData = calculateFormScore({
      accuracy: accuracyData.accuracy,
      completionPercentage,
      timeSpent,
      formTemplate: simulationData.formTemplate
    });
    
    // Call onComplete with enhanced results
    if (onComplete) {
      setTimeout(() => {
        onComplete({
          ...scoreData,
          accuracy: accuracyData.accuracy,
          timeSpent,
          formState,
          correctCount: accuracyData.correctCount,
          totalFields: accuracyData.totalCount,
          completionPercentage,
          fieldAccuracy: accuracyData.fieldAccuracy
        });
        setIsSubmitting(false);
      }, 1000);
    }
  };

  // Handle reset button click
  const handleReset = () => {
    window.location.reload();
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="form-simulation-loading flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading form simulation...</p>
        </div>
      </div>
    );
  }

  // Render error state if no simulation data
  if (!simulationData) {
    return (
      <div className="form-simulation-error bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Simulation Error</h3>
          <p className="text-red-600 mb-4">No simulation data provided</p>
          <button
            onClick={handleReset}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-simulation-container">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form panel - takes 2/3 of the space on large screens */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">{simulationData.formTemplate.title}</h3>
            
            <FormRenderer 
              formTemplate={simulationData.formTemplate}
              formState={formState}
              errors={errors}
              onDrop={handleDrop}
            />
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-lg text-white font-medium ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : 'Submit Form'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Information panel - takes 1/3 of the space on large screens */}
        <div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Victim Information</h3>
            
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Drag the information items below to the appropriate fields in the form.
              </p>
            </div>
            
            <DraggableInfoPanel 
              items={dragItems}
              scenario={simulationData.scenario}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

FormSimulationContainer.propTypes = {
  simulationData: PropTypes.shape({
    type: PropTypes.oneOf([SIMULATION_TYPES.FORM]),
    formTemplate: PropTypes.object.isRequired,
    dragItems: PropTypes.array.isRequired,
    scenario: PropTypes.object.isRequired
  }),
  userProfile: PropTypes.shape({
    name: PropTypes.string,
    avatarUrl: PropTypes.string
  }),
  onComplete: PropTypes.func
};

export default FormSimulationContainer;