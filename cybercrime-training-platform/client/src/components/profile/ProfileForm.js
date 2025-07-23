import React, { useState } from 'react';
import { Input, Button, FormGroup, FormLabel, FormError } from '../ui';

const ProfileForm = ({ profile, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    department: profile?.department || '',
    designation: profile?.designation || '',
    rank: profile?.rank || '',
    phoneNumber: profile?.phoneNumber || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }
    
    if (formData.phoneNumber && !/^(\+\d{1,3}[- ]?)?\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    
    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = 'Bio cannot exceed 500 characters';
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
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h2 className="text-xl font-medium text-gray-900 mb-6">Personal Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormGroup>
          <FormLabel htmlFor="name" required>Full Name</FormLabel>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
            error={errors.name}
          />
          {errors.name && <FormError error={errors.name} />}
        </FormGroup>
        
        <FormGroup>
          <FormLabel htmlFor="department" required>Department</FormLabel>
          <Input
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Enter your department"
            required
            error={errors.department}
          />
          {errors.department && <FormError error={errors.department} />}
        </FormGroup>
        
        <FormGroup>
          <FormLabel htmlFor="designation">Designation</FormLabel>
          <Input
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            placeholder="Enter your designation"
            error={errors.designation}
          />
          {errors.designation && <FormError error={errors.designation} />}
        </FormGroup>
        
        <FormGroup>
          <FormLabel htmlFor="rank">Rank</FormLabel>
          <Input
            id="rank"
            name="rank"
            value={formData.rank}
            onChange={handleChange}
            placeholder="Enter your rank"
            error={errors.rank}
          />
          {errors.rank && <FormError error={errors.rank} />}
        </FormGroup>
        
        <FormGroup>
          <FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter your phone number"
            error={errors.phoneNumber}
          />
          {errors.phoneNumber && <FormError error={errors.phoneNumber} />}
        </FormGroup>
        
        <FormGroup>
          <FormLabel htmlFor="location">Location</FormLabel>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter your location"
            error={errors.location}
          />
          {errors.location && <FormError error={errors.location} />}
        </FormGroup>
      </div>
      
      <FormGroup className="mt-4">
        <FormLabel htmlFor="bio">Bio</FormLabel>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself"
          rows={4}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-police-blue focus:border-police-blue ${
            errors.bio ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        <div className="mt-1 text-sm text-gray-500">
          {formData.bio.length}/500 characters
        </div>
        {errors.bio && <FormError error={errors.bio} />}
      </FormGroup>
      
      <div className="mt-6 flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;