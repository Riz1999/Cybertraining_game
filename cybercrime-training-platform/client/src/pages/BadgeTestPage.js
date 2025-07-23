import React from 'react';
import Module1CompletionTest from '../components/modules/Module1CompletionTest';

/**
 * Badge Test Page - for testing badge awarding functionality
 */
const BadgeTestPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Badge Awarding Test
          </h1>
          <p className="text-gray-600">
            Test the Module 1 completion and &ldquo;Cyber Awareness Starter&rdquo; badge awarding functionality
          </p>
        </div>
        
        <Module1CompletionTest />
      </div>
    </div>
  );
};

export default BadgeTestPage;