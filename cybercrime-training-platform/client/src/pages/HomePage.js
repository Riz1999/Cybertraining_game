import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const HomePage = () => {
  return (
    <Layout>
      <div className="py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-heading font-bold text-police-blue mb-6">
            Cybercrime Training Platform
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Interactive training modules for police officers to learn cybercrime investigation procedures
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/login"
              className="bg-police-blue text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-police-blue border border-police-blue py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-heading font-bold mb-4">Interactive Learning</h3>
            <p className="text-gray-700">
              Engage with realistic cybercrime scenarios and simulations designed to build practical skills.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-heading font-bold mb-4">Track Progress</h3>
            <p className="text-gray-700">
              Monitor your learning journey with detailed progress tracking and performance analytics.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-heading font-bold mb-4">Earn Certification</h3>
            <p className="text-gray-700">
              Complete all modules to receive official certification in cybercrime investigation procedures.
            </p>
          </div>
        </div>

        {/* Demo Section */}
        <div className="mt-16 bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-heading font-bold text-center mb-6">Try Our Interactive Demos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/system-map"
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-3xl mb-2">🗺️</div>
              <h3 className="font-semibold text-gray-800">System Map</h3>
              <p className="text-sm text-gray-600 mt-1">
                Explore cybercrime investigation systems
              </p>
            </Link>
            <Link
              to="/dialog-simulation"
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-3xl mb-2">💬</div>
              <h3 className="font-semibold text-gray-800">Dialog Simulation</h3>
              <p className="text-sm text-gray-600 mt-1">
                Practice victim interviews
              </p>
            </Link>
            <Link
              to="/timer-demo"
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-3xl mb-2">⏱️</div>
              <h3 className="font-semibold text-gray-800">Timer Challenge</h3>
              <p className="text-sm text-gray-600 mt-1">
                Time-critical response training
              </p>
            </Link>
            <Link
              to="/modules"
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <div className="text-3xl mb-2">📚</div>
              <h3 className="font-semibold text-gray-800">Full Modules</h3>
              <p className="text-sm text-gray-600 mt-1">
                Complete training modules
              </p>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;