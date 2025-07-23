import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearAuthError } from '../../store/actions/authActions';
import Input from '../ui/Input';
import Button from '../ui/Button';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
  });

  const [formErrors, setFormErrors] = useState({});
  
  const { name, email, password, confirmPassword, department } = formData;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    
    // Clear any previous errors when component mounts
    return () => {
      dispatch(clearAuthError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Clear error when user starts typing
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!department.trim()) {
      newErrors.department = 'Department is required';
    }
    
    return newErrors;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Register user
    const userData = {
      name,
      email,
      password,
      department
    };
    
    dispatch(register(userData));
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-heading font-bold text-center mb-6">Create an Account</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={onSubmit}>
        <Input
          type="text"
          id="name"
          name="name"
          label="Full Name"
          value={name}
          onChange={onChange}
          placeholder="Enter your full name"
          required
          error={formErrors.name}
          disabled={loading}
        />
        
        <Input
          type="email"
          id="email"
          name="email"
          label="Email Address"
          value={email}
          onChange={onChange}
          placeholder="Enter your email"
          required
          error={formErrors.email}
          disabled={loading}
        />
        
        <Input
          type="password"
          id="password"
          name="password"
          label="Password"
          value={password}
          onChange={onChange}
          placeholder="Create a password"
          required
          error={formErrors.password}
          disabled={loading}
        />
        
        <Input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          value={confirmPassword}
          onChange={onChange}
          placeholder="Confirm your password"
          required
          error={formErrors.confirmPassword}
          disabled={loading}
        />
        
        <Input
          type="text"
          id="department"
          name="department"
          label="Department"
          value={department}
          onChange={onChange}
          placeholder="Enter your police department"
          required
          error={formErrors.department}
          disabled={loading}
        />
        
        <div className="mt-6">
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="inline-block h-5 w-5 mr-2 border-t-2 border-b-2 border-white rounded-full animate-spin"></span>
                Registering...
              </span>
            ) : (
              'Register'
            )}
          </Button>
        </div>
      </form>
      <div className="mt-4 text-center">
        <p>
          Already have an account?{' '}
          <Link to="/login" className="text-primary-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;