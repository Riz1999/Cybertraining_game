import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the auth context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock login function - in a real app, this would call an API
  const login = async (email, password) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = {
          uid: 'user123',
          name: 'Officer Singh',
          email: email,
          department: 'Cybercrime Cell, Delhi Police',
          role: 'trainee'
        };
        
        setCurrentUser(user);
        localStorage.setItem('accessToken', 'mock-token-123');
        localStorage.setItem('user', JSON.stringify(user));
        resolve(user);
      }, 1000);
    });
  };

  // Mock logout function
  const logout = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setCurrentUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        resolve();
      }, 500);
    });
  };

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setCurrentUser(JSON.parse(user));
    }
    
    setLoading(false);
  }, []);

  // Context value
  const value = {
    currentUser,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;