import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Container from './Container';

/**
 * Responsive navigation component with mobile menu
 * @param {Object} props - Component props
 * @param {boolean} props.isAuthenticated - Whether the user is authenticated
 * @param {Object} props.user - User data
 * @returns {React.ReactElement} Navigation component
 */
const Navigation = ({ isAuthenticated = false, user = null }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Navigation links
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Modules', path: '/modules' },
    { name: 'Dashboard', path: '/dashboard', protected: true },
    { name: 'Certification', path: '/certification', protected: true },
  ];

  // Check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-police-blue text-white shadow-md">
      <Container>
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 mr-2 text-police-gold"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-heading font-bold text-xl">CyberTrain</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks
              .filter((link) => !link.protected || isAuthenticated)
              .map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`py-2 px-1 font-medium hover:text-police-gold transition-colors border-b-2 ${
                    isActive(link.path)
                      ? 'border-police-gold text-police-gold'
                      : 'border-transparent'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

            {/* Authentication Links */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 py-2 px-1 font-medium hover:text-police-gold transition-colors">
                  <span>{user?.name || 'User'}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </Link>
                  <div className="border-t border-gray-100"></div>
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="py-2 px-4 font-medium hover:text-police-gold transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="py-2 px-4 bg-police-gold text-police-blue font-medium rounded-md hover:bg-yellow-400 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-police-gold focus:outline-none"
            >
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-police-blue border-t border-blue-900">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks
              .filter((link) => !link.protected || isAuthenticated)
              .map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(link.path)
                      ? 'bg-blue-900 text-white'
                      : 'text-gray-100 hover:bg-blue-800'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

            {/* Authentication Links for Mobile */}
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-100 hover:bg-blue-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-100 hover:bg-blue-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-100 hover:bg-blue-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-100 hover:bg-blue-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-base font-medium bg-police-gold text-police-blue hover:bg-yellow-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;