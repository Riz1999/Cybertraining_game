import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearAuthError } from '../../store/actions/authActions';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const { email, password } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to the page they were trying to access, or dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from);
    }
    
    // Clear any previous errors when component mounts
    return () => {
      dispatch(clearAuthError());
    };
  }, [isAuthenticated, navigate, location, dispatch]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-heading font-bold text-center mb-6">Login</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
            disabled={loading}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-police-blue text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex justify-center items-center"
          disabled={loading}
        >
          {loading ? (
            <span className="inline-block h-5 w-5 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></span>
          ) : null}
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="mt-4 text-center">
        <p>
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-primary-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;