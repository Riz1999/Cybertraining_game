import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ModulePrerequisites = ({ moduleId, prerequisites }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <div className="bg-yellow-100 p-2 rounded-full mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold">Prerequisites Required</h2>
      </div>
      
      <p className="text-gray-700 mb-6">
        Before you can access this module, you need to complete the following prerequisites:
      </p>
      
      <div className="space-y-4 mb-8">
        {prerequisites.map((prerequisite) => (
          <div key={prerequisite.moduleId} className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-lg mb-2">{prerequisite.title}</h3>
            {prerequisite.reason && (
              <p className="text-gray-600 mb-3">{prerequisite.reason}</p>
            )}
            <Link 
              to={`/modules/${prerequisite.moduleId}`}
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Module
            </Link>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-800 mb-2">Why Prerequisites Matter</h3>
        <p className="text-blue-700">
          Each module builds upon knowledge and skills from previous modules. 
          Completing prerequisites ensures you have the necessary foundation to succeed in this module.
        </p>
      </div>
    </div>
  );
};

ModulePrerequisites.propTypes = {
  moduleId: PropTypes.string.isRequired,
  prerequisites: PropTypes.arrayOf(
    PropTypes.shape({
      moduleId: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      reason: PropTypes.string
    })
  ).isRequired
};

export default ModulePrerequisites;