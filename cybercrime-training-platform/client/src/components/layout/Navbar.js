import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/actions/authActions';

/**
 * Navigation bar component
 * Shows different navigation options based on authentication status
 */
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-police-blue text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold flex items-center">
            <span className="mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </span>
            Cybercrime Training
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="hover:text-gray-300 px-3 py-2">Home</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="hover:text-gray-300 px-3 py-2">Dashboard</Link>
                <Link to="/modules" className="hover:text-gray-300 px-3 py-2">Modules</Link>
                <div className="relative group">
                  <button className="flex items-center hover:text-gray-300 px-3 py-2">
                    <span className="mr-1">{user?.name || 'User'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-gray-300 px-3 py-2">Login</Link>
                <Link to="/register" className="bg-white text-police-blue px-4 py-2 rounded-md hover:bg-gray-100">Register</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-700">
            <Link to="/" className="block py-2 hover:bg-blue-700" onClick={closeMenu}>Home</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block py-2 hover:bg-blue-700" onClick={closeMenu}>Dashboard</Link>
                <Link to="/modules" className="block py-2 hover:bg-blue-700" onClick={closeMenu}>Modules</Link>
                <Link to="/profile" className="block py-2 hover:bg-blue-700" onClick={closeMenu}>Profile</Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="block w-full text-left py-2 hover:bg-blue-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 hover:bg-blue-700" onClick={closeMenu}>Login</Link>
                <Link to="/register" className="block py-2 hover:bg-blue-700" onClick={closeMenu}>Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;