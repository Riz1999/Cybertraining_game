import React from 'react';
import { Card, ProgressBar, Button } from '../ui';

/**
 * Certification Progress component for displaying progress towards certification
 * @param {Object} props - Component props
 * @param {Object} props.eligibility - Certification eligibility data
 * @param {boolean} props.loading - Loading state
 * @param {string} props.className - Additional CSS classes
 * @returns {React.ReactElement} Certification Progress component
 */
const CertificationProgress = ({ eligibility, loading = false, className = '' }) => {
  if (!eligibility && !loading) {
    return null;
  }

  return (
    <Card className={className}>
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Certification Progress</h3>
      </div>
      
      <div className="p-4">
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-police-blue"></div>
          </div>
        ) : eligibility ? (
          <div>
            <div className="flex justify-between items-center mb-2">
              <div className="font-medium text-gray-700">Overall Score</div>
              <div className="text-lg font-bold text-gray-900">{eligibility.overallScore}%</div>
            </div>
            
            <ProgressBar
              value={eligibility.overallScore}
              variant={eligibility.isEligible ? 'success' : 'police'}
              size="md"
              showLabel
            />
            
            <div className="mt-4">
              <div className="font-medium text-gray-700 mb-2">Required Modules</div>
              <div className="space-y-2">
                {eligibility.requiredModules.map((module) => (
                  <div key={module.moduleId} className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">{module.title || module.moduleId}</div>
                    <div className="flex items-center">
                      {module.completed ? (
                        <span className="text-green-600 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {module.score}%
                        </span>
                      ) : (
                        <span className="text-gray-400 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          Incomplete
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {eligibility.optionalModules && eligibility.optionalModules.length > 0 && (
              <div className="mt-4">
                <div className="font-medium text-gray-700 mb-2">Optional Modules</div>
                <div className="space-y-2">
                  {eligibility.optionalModules.map((module) => (
                    <div key={module.moduleId} className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">{module.title || module.moduleId}</div>
                      <div className="flex items-center">
                        {module.completed ? (
                          <span className="text-green-600 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {module.score}%
                          </span>
                        ) : (
                          <span className="text-gray-400 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            Optional
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {eligibility.missingRequirements && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="font-medium text-yellow-800 mb-1">Requirements to Complete</div>
                <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                  {eligibility.missingRequirements.map((req, index) => (
                    <li key={index}>{req.details}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-6 flex justify-center">
              <Button
                variant={eligibility.isEligible ? 'success' : 'outline'}
                disabled={!eligibility.isEligible}
              >
                {eligibility.isEligible ? 'Generate Certificate' : 'Complete Requirements'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">
            No certification data available
          </div>
        )}
      </div>
    </Card>
  );
};

export default CertificationProgress;