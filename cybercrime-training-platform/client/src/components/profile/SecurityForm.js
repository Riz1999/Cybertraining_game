import React, { useState } from 'react';
import { Input, Button, FormGroup, FormLabel, FormError } from '../ui';

const SecurityForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    onSubmit(formData);
    
    // Clear form after submission
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h2 className="text-xl font-medium text-gray-900 mb-6">Security</h2>
      
      <div className="max-w-md">
        <FormGroup>
          <FormLabel htmlFor="currentPassword" required>Current Password</FormLabel>
          <Input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="Enter your current password"
            required
            error={errors.currentPassword}
          />
          {errors.currentPassword && <FormError error={errors.currentPassword} />}
        </FormGroup>
        
        <FormGroup>
          <FormLabel htmlFor="newPassword" required>New Password</FormLabel>
          <Input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter your new password"
            required
            error={errors.newPassword}
          />
          {errors.newPassword && <FormError error={errors.newPassword} />}
          <div className="mt-1 text-sm text-gray-500">
            Password must be at least 6 characters long
          </div>
        </FormGroup>
        
        <FormGroup>
          <FormLabel htmlFor="confirmPassword" required>Confirm New Password</FormLabel>
          <Input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your new password"
            required
            error={errors.confirmPassword}
          />
          {errors.confirmPassword && <FormError error={errors.confirmPassword} />}
        </FormGroup>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? 'Changing Password...' : 'Change Password'}
        </Button>
      </div>
    </form>
  );
};

export default SecurityForm;