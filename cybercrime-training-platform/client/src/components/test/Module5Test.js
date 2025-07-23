import React from 'react';
import { Link } from 'react-router-dom';

const Module5Test = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Module 5: Financial Fraud Investigation - Test Page</h1>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Module 5 Structure</h2>
        <p className="text-gray-700 mb-4">
          This module consists of 5 levels that guide officers through a complete financial fraud investigation:
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm mr-3">Level 1</span>
            <Link 
              to="/modules/module-5-financial-fraud-investigation/complaint-analysis"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Complaint Analysis and Jurisdiction
            </Link>
          </div>
          
          <div className="flex items-center">
            <span className="bg-gray-400 text-white px-2 py-1 rounded text-sm mr-3">Level 2</span>
            <span className="text-gray-600">First Response and Evidence Collection (Coming Soon)</span>
          </div>
          
          <div className="flex items-center">
            <span className="bg-gray-400 text-white px-2 py-1 rounded text-sm mr-3">Level 3</span>
            <span className="text-gray-600">Tracing the Transaction Trail (Coming Soon)</span>
          </div>
          
          <div className="flex items-center">
            <span className="bg-gray-400 text-white px-2 py-1 rounded text-sm mr-3">Level 4</span>
            <span className="text-gray-600">Building the Legal Case (Coming Soon)</span>
          </div>
          
          <div className="flex items-center">
            <span className="bg-gray-400 text-white px-2 py-1 rounded text-sm mr-3">Level 5</span>
            <span className="text-gray-600">Arrest and Prosecution (Coming Soon)</span>
          </div>
        </div>
      </div>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">What&apos;s Implemented</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Complete Level 1: Complaint Analysis and Jurisdiction</li>
          <li>Interactive tasks: Jurisdiction identification, Evidence extraction, FIR documentation, Hotspot identification</li>
          <li>Knowledge check quiz with 5 questions</li>
          <li>Progress tracking and scoring system</li>
          <li>Module completion and badge awarding</li>
        </ul>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Scenario Overview</h2>
        <p className="text-gray-700">
          <strong>Case:</strong> Mr. Rajesh Kumar from Pune reports a loss of Rs. 2.5 lakh from his SBI account 
          after clicking on a fraudulent link from a fake investment app called &quot;QuickGrowth Investments&quot;.
        </p>
        <p className="text-gray-700 mt-2">
          <strong>Learning Objectives:</strong> Officers learn to analyze complaints, identify jurisdiction, 
          extract key evidence, complete FIR documentation, and identify suspicious elements in digital evidence.
        </p>
      </div>
      
      <div className="flex space-x-4">
        <Link 
          to="/modules/module-5-financial-fraud-investigation/complaint-analysis"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Start Level 1
        </Link>
        
        <Link 
          to="/modules"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back to Modules
        </Link>
      </div>
    </div>
  );
};

export default Module5Test;