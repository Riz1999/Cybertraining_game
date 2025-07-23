import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Post-Arrest Reporting Interface Component
 * 
 * This component provides an interface for completing post-arrest
 * documentation and reports.
 */
const PostArrestReportingInterface = ({ reportingData, onComplete }) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const { title, description, reportSections } = reportingData;
  const currentSection = reportSections[currentSectionIndex];
  const totalSections = reportSections.length;

  const handleInputChange = (sectionId, fieldId, value) => {
    setFormValues(prevValues => ({
      ...prevValues,
      [`${sectionId}-${fieldId}`]: value
    }));

    // Clear error if field was previously marked as error
    if (formErrors[`${sectionId}-${fieldId}`]) {
      setFormErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[`${sectionId}-${fieldId}`];
        return newErrors;
      });
    }
  };

  const validateSection = (section) => {
    const newErrors = {};
    let isValid = true;

    section.fields.forEach(field => {
      const fieldKey = `${section.id}-${field.id}`;
      const value = formValues[fieldKey];

      if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
        newErrors[fieldKey] = 'This field is required';
        isValid = false;
      }
    });

    setFormErrors(prevErrors => ({
      ...prevErrors,
      ...newErrors
    }));

    return isValid;
  };

  const handleNextSection = () => {
    if (validateSection(currentSection)) {
      if (currentSectionIndex < totalSections - 1) {
        setCurrentSectionIndex(prevIndex => prevIndex + 1);
      } else {
        // All sections completed
        const calculatedScore = calculateScore();
        setScore(calculatedScore);
        setCompleted(true);
        
        if (onComplete) {
          onComplete(calculatedScore);
        }
      }
    }
  };

  const handlePreviousSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prevIndex => prevIndex - 1);
    }
  };

  const calculateScore = () => {
    // Count total required fields and correctly filled fields
    let totalRequiredFields = 0;
    let correctlyFilledFields = 0;

    reportSections.forEach(section => {
      section.fields.forEach(field => {
        if (field.required) {
          totalRequiredFields++;
          const fieldKey = `${section.id}-${field.id}`;
          const value = formValues[fieldKey];
          
          if (value && (!Array.isArray(value) || value.length > 0)) {
            correctlyFilledFields++;
          }
        }
      });
    });

    // Calculate percentage and convert to score out of 100
    return Math.round((correctlyFilledFields / totalRequiredFields) * 100);
  };

  const renderField = (section, field) => {
    const fieldKey = `${section.id}-${field.id}`;
    const value = formValues[fieldKey] || field.value || '';
    const error = formErrors[fieldKey];

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            id={fieldKey}
            value={value}
            onChange={(e) => handleInputChange(section.id, field.id, e.target.value)}
            className={`w-full p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
          />
        );
      
      case 'date':
        return (
          <input
            type="date"
            id={fieldKey}
            value={value}
            onChange={(e) => handleInputChange(section.id, field.id, e.target.value)}
            className={`w-full p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            id={fieldKey}
            value={value}
            onChange={(e) => handleInputChange(section.id, field.id, e.target.value)}
            rows={4}
            className={`w-full p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
          />
        );
      
      case 'select':
        return (
          <select
            id={fieldKey}
            value={value}
            onChange={(e) => handleInputChange(section.id, field.id, e.target.value)}
            className={`w-full p-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">-- Select --</option>
            {field.options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options.map(option => (
              <div key={option} className="flex items-center">
                <input
                  type="checkbox"
                  id={`${fieldKey}-${option}`}
                  checked={Array.isArray(value) && value.includes(option)}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? [...value] : [];
                    if (e.target.checked) {
                      handleInputChange(section.id, field.id, [...currentValues, option]);
                    } else {
                      handleInputChange(
                        section.id,
                        field.id,
                        currentValues.filter(val => val !== option)
                      );
                    }
                  }}
                  className="mr-2"
                />
                <label htmlFor={`${fieldKey}-${option}`}>{option}</label>
              </div>
            ))}
          </div>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options.map(option => (
              <div key={option} className="flex items-center">
                <input
                  type="radio"
                  id={`${fieldKey}-${option}`}
                  name={fieldKey}
                  value={option}
                  checked={value === option}
                  onChange={() => handleInputChange(section.id, field.id, option)}
                  className="mr-2"
                />
                <label htmlFor={`${fieldKey}-${option}`}>{option}</label>
              </div>
            ))}
          </div>
        );
      
      default:
        return <div>Unsupported field type: {field.type}</div>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-600 mt-2">{description}</p>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Section {currentSectionIndex + 1} of {totalSections}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentSectionIndex + 1) / totalSections) * 100}%` }}
          ></div>
        </div>
      </div>

      {!completed ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {currentSection.title}
          </h3>

          <div className="space-y-6">
            {currentSection.fields.map(field => (
              <div key={field.id} className="space-y-2">
                <label 
                  htmlFor={`${currentSection.id}-${field.id}`}
                  className="block text-sm font-medium text-gray-700"
                >
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                
                {renderField(currentSection, field)}
                
                {formErrors[`${currentSection.id}-${field.id}`] && (
                  <p className="text-sm text-red-600 mt-1">
                    {formErrors[`${currentSection.id}-${field.id}`]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handlePreviousSection}
              disabled={currentSectionIndex === 0}
              className={`px-4 py-2 rounded-md ${
                currentSectionIndex === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>
            
            <button
              type="button"
              onClick={handleNextSection}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {currentSectionIndex === totalSections - 1 ? 'Submit Report' : 'Next'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-green-800 mb-3">
            Report Completed!
          </h3>
          <p className="text-green-700 mb-4">
            You have successfully completed the post-arrest report.
          </p>
          <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-green-100">
            <span className="font-medium">Report Accuracy:</span>
            <span className="text-xl font-bold">{score}%</span>
          </div>
          
          {score < 80 && (
            <p className="mt-4 text-amber-700">
              Your report has some missing or incorrect information. In a real case, this could cause legal complications.
            </p>
          )}
          
          {score >= 80 && score < 100 && (
            <p className="mt-4 text-green-700">
              Good job! Your report is mostly complete and accurate.
            </p>
          )}
          
          {score === 100 && (
            <p className="mt-4 text-green-700">
              Excellent! Your report is complete and accurate, which will ensure proper case processing.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

PostArrestReportingInterface.propTypes = {
  reportingData: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    reportSections: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        fields: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            type: PropTypes.string.isRequired,
            required: PropTypes.bool,
            options: PropTypes.arrayOf(PropTypes.string),
            value: PropTypes.any
          })
        ).isRequired
      })
    ).isRequired
  }).isRequired,
  onComplete: PropTypes.func
};

export default PostArrestReportingInterface;