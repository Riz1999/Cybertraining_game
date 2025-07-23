import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const ModuleCompletion = ({ title, score, maxScore, message, nextModule, onContinue }) => {
  const percentage = Math.round((score / maxScore) * 100);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col items-center mb-8">
        <div className="bg-green-100 p-4 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-center">{title}</h2>
      </div>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium">Your Score</p>
          <p className="text-sm font-medium">{score}/{maxScore} points ({percentage}%)</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${
              percentage >= 80 ? 'bg-green-600' : percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
        <p className="text-blue-700">{message}</p>
      </div>
      
      {nextModule && (
        <div className="border border-gray-200 rounded-lg p-4 mb-8">
          <h3 className="font-medium text-lg mb-2">Next Up: {nextModule.title}</h3>
          <p className="text-gray-600 mb-4">{nextModule.description}</p>
          <button
            onClick={onContinue}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue to Next Level
          </button>
        </div>
      )}
      
      <div className="flex justify-between">
        <Link 
          to="/dashboard"
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Return to Dashboard
        </Link>
        
        <Link 
          to="/modules"
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          View All Modules
        </Link>
      </div>
    </div>
  );
};

ModuleCompletion.propTypes = {
  title: PropTypes.string.isRequired,
  score: PropTypes.number.isRequired,
  maxScore: PropTypes.number.isRequired,
  message: PropTypes.string.isRequired,
  nextModule: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  }),
  onContinue: PropTypes.func
};

export default ModuleCompletion;