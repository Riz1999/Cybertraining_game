import React from 'react';

/**
 * Footer component
 * @returns {React.ReactNode} - Footer component
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold">Cybercrime Training Platform</h3>
            <p className="text-sm text-gray-400">Training police officers in cybercrime investigation</p>
          </div>
          
          <div className="text-sm text-gray-400">
            &copy; {currentYear} Cybercrime Training Platform. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;