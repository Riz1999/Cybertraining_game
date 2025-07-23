import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-police-blue text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-heading font-bold">
            <Link to="/">Cybercrime Training Platform</Link>
          </h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link to="/" className="hover:text-police-gold transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/modules" className="hover:text-police-gold transition-colors">
                Modules
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-police-gold transition-colors">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-police-gold transition-colors">
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;