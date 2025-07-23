import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const Module5TestPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Module 5: Financial Fraud Investigation - Test</h1>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Module 5 Status Check</h2>
          <p className="mb-4">This page is to test if Module 5 routing is working correctly.</p>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Available Routes:</h3>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/modules/module-5-financial-fraud-investigation/complaint-analysis"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Level 1: Complaint Analysis and Jurisdiction
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/modules/module-5-financial-fraud-investigation/evidence-collection"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Level 2: Evidence Collection
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/modules/module-5-financial-fraud-investigation/transaction-tracing"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Level 3: Transaction Tracing
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/modules/module-5-financial-fraud-investigation/legal-case-building"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Level 4: Legal Case Building
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/modules/module-5-financial-fraud-investigation/arrest-prosecution"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Level 5: Arrest and Prosecution
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/modules/module-5-financial-fraud-investigation"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Module 5 Main Page (should show error for now)
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/modules"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Back to All Modules
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Expected Behavior:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Module 5 should appear in the modules list</li>
                <li>It should be available (not locked) since we removed prerequisites</li>
                <li>Clicking &quot;Start&quot; should redirect to Level 1</li>
                <li>Level 1 should load the ComplaintAnalysisModule component</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Module 5 Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Module Information:</h3>
              <ul className="space-y-1 text-sm">
                <li><strong>ID:</strong> module-5-financial-fraud-investigation</li>
                <li><strong>Title:</strong> Financial Fraud Investigation</li>
                <li><strong>Duration:</strong> 90 minutes</li>
                <li><strong>Activities:</strong> 5 levels</li>
                <li><strong>Badge:</strong> Financial Fraud Investigator</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Implementation Status:</h3>
              <ul className="space-y-1 text-sm">
                <li>✅ Level 1: Complaint Analysis (Implemented)</li>
                <li>✅ Level 2: Evidence Collection (Implemented)</li>
                <li>✅ Level 3: Transaction Tracing (Implemented)</li>
                <li>✅ Level 4: Legal Case Building (Implemented)</li>
                <li>✅ Level 5: Arrest & Prosecution (Implemented)</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-4">
          <Link 
            to="/modules/module-5-financial-fraud-investigation/complaint-analysis"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Test Level 1 Directly
          </Link>
          
          <Link 
            to="/modules"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Go to Modules Page
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Module5TestPage;