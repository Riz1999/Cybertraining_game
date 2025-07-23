import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = ({ message = "404 - Page Not Found" }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">{message}</h1>
      <p className="text-lg text-gray-600 mb-8">
        The page you&#39;re looking for doesn&#39;t exist or has been moved.
      </p>
      <Link 
        to="/dashboard" 
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;