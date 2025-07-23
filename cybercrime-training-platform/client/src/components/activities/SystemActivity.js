import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '../ui/Card';
import Button from '../ui/Button';

/**
 * SystemActivity Component
 * 
 * This component simulates interaction with external systems like CCTNS,
 * allowing users to practice system procedures in a safe environment.
 */
const SystemActivity = ({ 
  title, 
  description, 
  systemName,
  steps = [],
  formFields = [],
  sampleData = {},
  validationRules = {},
  onComplete 
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formValues, setFormValues] = useState(sampleData || {});
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showHints, setShowHints] = useState({});
  
  // Handle form field changes
  const handleFieldChange = (fieldId, value) => {
    setFormValues({
      ...formValues,
      [fieldId]: value
    });
    
    // Clear error when field is edited
    if (formErrors[fieldId]) {
      setFormErrors({
        ...formErrors,
        [fieldId]: null
      });
    }
  };
  
  // Toggle hint visibility
  const toggleHint = (fieldId) => {
    setShowHints({
      ...showHints,
      [fieldId]: !showHints[fieldId]
    });
  };
  
  // Validate form fields
  const validateForm = () => {
    const errors = {};
    let isValid = true;
    
    // Apply validation rules
    Object.keys(validationRules).forEach(fieldId => {
      const rules = validationRules[fieldId];
      const value = formValues[fieldId];
      
      if (rules.required && (!value || value.trim() === '')) {
        errors[fieldId] = 'This field is required';
        isValid = false;
      } else if (rules.pattern && value && !new RegExp(rules.pattern).test(value)) {
        errors[fieldId] = rules.message || 'Invalid format';
        isValid = false;
      } else if (rules.minLength && value && value.length < rules.minLength) {
        errors[fieldId] = `Must be at least ${rules.minLength} characters`;
        isValid = false;
      } else if (rules.maxLength && value && value.length > rules.maxLength) {
        errors[fieldId] = `Must be no more than ${rules.maxLength} characters`;
        isValid = false;
      } else if (rules.validate && !rules.validate(value, formValues)) {
        errors[fieldId] = rules.message || 'Invalid value';
        isValid = false;
      }
    });
    
    setFormErrors(errors);
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      setIsSubmitted(true);
    }
  };
  
  // Handle step navigation
  const handleNextStep = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      // If this is the last step, show the form
      setActiveStep(steps.length);
    }
  };
  
  const handlePrevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };
  
  // Complete the activity
  const handleComplete = () => {
    setIsComplete(true);
    
    if (onComplete) {
      onComplete({
        completed: true,
        formValues,
        timeSpent: 0 // This would ideally track actual time spent
      });
    }
  };
  
  // Render form fields
  const renderFormFields = () => {
    return (
      <div className="space-y-6">
        {formFields.map(field => {
          const error = formErrors[field.id];
          
          return (
            <div key={field.id} className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                
                {field.hint && (
                  <button
                    type="button"
                    onClick={() => toggleHint(field.id)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    {showHints[field.id] ? 'Hide Hint' : 'Show Hint'}
                  </button>
                )}
              </div>
              
              {showHints[field.id] && field.hint && (
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  {field.hint}
                </div>
              )}
              
              {field.type === 'text' && (
                <input
                  type="text"
                  id={field.id}
                  value={formValues[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  disabled={isSubmitted}
                  className={`mt-1 block w-full rounded-md shadow-sm ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  placeholder={field.placeholder}
                />
              )}
              
              {field.type === 'textarea' && (
                <textarea
                  id={field.id}
                  value={formValues[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  disabled={isSubmitted}
                  rows={4}
                  className={`mt-1 block w-full rounded-md shadow-sm ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                  placeholder={field.placeholder}
                />
              )}
              
              {field.type === 'select' && (
                <select
                  id={field.id}
                  value={formValues[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  disabled={isSubmitted}
                  className={`mt-1 block w-full rounded-md shadow-sm ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                >
                  <option value="">Select an option</option>
                  {field.options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
              
              {field.type === 'date' && (
                <input
                  type="date"
                  id={field.id}
                  value={formValues[field.id] || ''}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  disabled={isSubmitted}
                  className={`mt-1 block w-full rounded-md shadow-sm ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
                />
              )}
              
              {field.type === 'radio' && (
                <div className="mt-1 space-y-2">
                  {field.options.map(option => (
                    <div key={option.value} className="flex items-center">
                      <input
                        id={`${field.id}-${option.value}`}
                        name={field.id}
                        type="radio"
                        value={option.value}
                        checked={formValues[field.id] === option.value}
                        onChange={() => handleFieldChange(field.id, option.value)}
                        disabled={isSubmitted}
                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor={`${field.id}-${option.value}`} className="ml-2 block text-sm text-gray-700">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              )}
              
              {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
              )}
            </div>
          );
        })}
      </div>
    );
  };
  
  // Render system interface
  const renderSystemInterface = () => {
    return (
      <div className="border rounded-lg overflow-hidden">
        {/* System header */}
        <div className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
            <span className="font-medium">{systemName || 'System Interface'}</span>
          </div>
          <div className="text-xs bg-green-500 px-2 py-0.5 rounded">TRAINING MODE</div>
        </div>
        
        {/* System content */}
        <div className="p-6 bg-white">
          {!isSubmitted ? (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Enter Information</h3>
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                {renderFormFields()}
                
                <div className="mt-8 flex justify-end space-x-3">
                  <Button
                    type="button"
                    onClick={() => setActiveStep(steps.length - 1)}
                    variant="secondary"
                  >
                    Back to Instructions
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="primary"
                  >
                    Submit to {systemName}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div>
              <div className="rounded-md bg-green-50 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Submission Successful</h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>Your information has been successfully submitted to the {systemName} system.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-4">Submission Summary</h3>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <dl className="space-y-3">
                  {formFields.map(field => (
                    <div key={field.id} className="grid grid-cols-3 gap-4">
                      <dt className="text-sm font-medium text-gray-500">{field.label}</dt>
                      <dd className="text-sm text-gray-900 col-span-2">{formValues[field.id] || '-'}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleComplete}
                  variant="success"
                >
                  Complete Activity
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>
      
      <div className="p-6">
        {/* Step content */}
        {activeStep < steps.length ? (
          <div>
            {/* Step progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span>Step {activeStep + 1} of {steps.length}</span>
                <span>{Math.round(((activeStep + 1) / steps.length) * 100)}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{steps[activeStep].title}</h3>
            
            <div className="prose max-w-none">
              {steps[activeStep].content}
            </div>
            
            {steps[activeStep].image && (
              <div className="mt-6 border rounded-lg overflow-hidden">
                <img 
                  src={steps[activeStep].image} 
                  alt={steps[activeStep].title} 
                  className="w-full h-auto"
                />
                {steps[activeStep].imageCaption && (
                  <div className="bg-gray-50 px-4 py-2 text-sm text-gray-600">
                    {steps[activeStep].imageCaption}
                  </div>
                )}
              </div>
            )}
            
            <div className="mt-8 flex justify-between">
              <Button
                onClick={handlePrevStep}
                disabled={activeStep === 0}
                variant="secondary"
              >
                Previous
              </Button>
              
              <Button
                onClick={handleNextStep}
                variant="primary"
              >
                {activeStep === steps.length - 1 ? 'Continue to System' : 'Next'}
              </Button>
            </div>
          </div>
        ) : (
          renderSystemInterface()
        )}
      </div>
    </Card>
  );
};

SystemActivity.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  systemName: PropTypes.string.isRequired,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
      image: PropTypes.string,
      imageCaption: PropTypes.string
    })
  ).isRequired,
  formFields: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['text', 'textarea', 'select', 'date', 'radio']).isRequired,
      required: PropTypes.bool,
      placeholder: PropTypes.string,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired
        })
      ),
      hint: PropTypes.string
    })
  ).isRequired,
  sampleData: PropTypes.object,
  validationRules: PropTypes.object,
  onComplete: PropTypes.func
};

export default SystemActivity;