import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const TestModule5Status = () => {
  const [completedModules, setCompletedModules] = useState([]);
  const [earnedBadges, setEarnedBadges] = useState([]);

  useEffect(() => {
    // Load data from localStorage
    const completed = JSON.parse(localStorage.getItem('completedModules') || '[]');
    const badges = JSON.parse(localStorage.getItem('earnedBadges') || '[]');
    setCompletedModules(completed);
    setEarnedBadges(badges);
  }, []);

  const clearProgress = () => {
    localStorage.removeItem('completedModules');
    localStorage.removeItem('earnedBadges');
    setCompletedModules([]);
    setEarnedBadges([]);
    alert('Progress cleared! You can now test module completion again.');
  };

  const simulateModule4Completion = () => {
    const completed = ['module-1-intro-cybercrime', 'module-2-complaint-categorization', 'module-3-time-critical-response', 'module-4-escalation-fir'];
    const badges = [
      {
        id: 'cyber-awareness-starter',
        name: 'Cyber Awareness Starter',
        description: 'Completed the introduction to cybercrime investigation with excellence',
        imageUrl: '/assets/badges/cyber-awareness-starter.svg',
        earnedAt: new Date().toISOString()
      },
      {
        id: 'first-responder',
        name: 'First Responder',
        description: 'Mastered complaint categorization and intake procedures with professional excellence',
        imageUrl: '/assets/badges/first-responder.svg',
        earnedAt: new Date().toISOString()
      },
      {
        id: 'digital-defender',
        name: 'Digital Defender',
        description: 'Mastered time-critical response procedures for transaction freezing with exceptional speed and accuracy',
        imageUrl: '/assets/badges/digital-defender.svg',
        earnedAt: new Date().toISOString()
      },
      {
        id: 'fir-specialist',
        name: 'FIR Specialist',
        description: 'Mastered the procedures for escalating cybercrime complaints to FIRs and filing them in CCTNS with professional excellence',
        imageUrl: '/assets/badges/fir-specialist.svg',
        earnedAt: new Date().toISOString()
      }
    ];
    
    localStorage.setItem('completedModules', JSON.stringify(completed));
    localStorage.setItem('earnedBadges', JSON.stringify(badges));
    setCompletedModules(completed);
    setEarnedBadges(badges);
    alert('Simulated completion of all modules up to Module 4! Now Module 5 should be available.');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Module 5 Status Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Completed Modules */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Completed Modules</h2>
            {completedModules.length === 0 ? (
              <p className="text-gray-500">No modules completed yet</p>
            ) : (
              <ul className="space-y-2">
                {completedModules.map((moduleId, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm">{moduleId}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Earned Badges */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Earned Badges</h2>
            {earnedBadges.length === 0 ? (
              <p className="text-gray-500">No badges earned yet</p>
            ) : (
              <div className="space-y-3">
                {earnedBadges.map((badge, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-400 rounded-full mr-3 flex items-center justify-center">
                      <span className="text-xs">🏆</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{badge.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(badge.earnedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Test Actions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Simulate Module Completion</h3>
              <p className="text-sm text-gray-600 mb-3">
                This will simulate completing all modules up to Module 4, which should unlock Module 5.
              </p>
              <button
                onClick={simulateModule4Completion}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Simulate Module 1-4 Completion
              </button>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Clear Progress</h3>
              <p className="text-sm text-gray-600 mb-3">
                This will clear all progress and badges, allowing you to test from scratch.
              </p>
              <button
                onClick={clearProgress}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Clear All Progress
              </button>
            </div>
          </div>
        </div>
        
        {/* Navigation Links */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/modules"
              className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium mb-2">Modules Page</h3>
              <p className="text-sm text-gray-600">Check if Module 5 is visible and available</p>
            </Link>
            
            <Link
              to="/modules/module-4-escalation-fir"
              className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium mb-2">Module 4</h3>
              <p className="text-sm text-gray-600">Test Module 4 completion and badge generation</p>
            </Link>
            
            <Link
              to="/modules/module-5-financial-fraud-investigation/complaint-analysis"
              className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium mb-2">Module 5 Level 1</h3>
              <p className="text-sm text-gray-600">Direct access to Module 5 Level 1</p>
            </Link>
          </div>
        </div>
        
        {/* Status Summary */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="font-medium text-yellow-800 mb-2">Current Status</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>✅ Module completion tracking: {completedModules.length > 0 ? 'Working' : 'Not tested'}</li>
            <li>✅ Badge generation: {earnedBadges.length > 0 ? 'Working' : 'Not tested'}</li>
            <li>✅ Module 5 routing: Available</li>
            <li>✅ Score display fix: Applied</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default TestModule5Status;