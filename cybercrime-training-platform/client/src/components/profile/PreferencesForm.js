import React, { useState } from 'react';
import { Button, FormGroup, FormLabel } from '../ui';

const PreferencesForm = ({ preferences, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    notifications: {
      email: preferences?.notifications?.email ?? true,
      inApp: preferences?.notifications?.inApp ?? true,
    },
    theme: preferences?.theme || 'system',
    language: preferences?.language || 'en',
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    const [category, field] = name.split('.');
    
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: checked,
      },
    }));
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Language options
  const languages = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
    { value: 'ta', label: 'Tamil' },
    { value: 'te', label: 'Telugu' },
    { value: 'bn', label: 'Bengali' },
    { value: 'mr', label: 'Marathi' },
    { value: 'gu', label: 'Gujarati' },
    { value: 'kn', label: 'Kannada' },
    { value: 'ml', label: 'Malayalam' },
    { value: 'pa', label: 'Punjabi' },
    { value: 'or', label: 'Odia' },
    { value: 'as', label: 'Assamese' },
  ];

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <h2 className="text-xl font-medium text-gray-900 mb-6">Preferences</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="notifications.email"
              name="notifications.email"
              checked={formData.notifications.email}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-police-blue focus:ring-police-blue border-gray-300 rounded"
            />
            <label htmlFor="notifications.email" className="ml-2 block text-sm text-gray-700">
              Email Notifications
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="notifications.inApp"
              name="notifications.inApp"
              checked={formData.notifications.inApp}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-police-blue focus:ring-police-blue border-gray-300 rounded"
            />
            <label htmlFor="notifications.inApp" className="ml-2 block text-sm text-gray-700">
              In-App Notifications
            </label>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Theme</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="theme-light"
              name="theme"
              value="light"
              checked={formData.theme === 'light'}
              onChange={handleRadioChange}
              className="h-4 w-4 text-police-blue focus:ring-police-blue border-gray-300"
            />
            <label htmlFor="theme-light" className="ml-2 block text-sm text-gray-700">
              Light
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="radio"
              id="theme-dark"
              name="theme"
              value="dark"
              checked={formData.theme === 'dark'}
              onChange={handleRadioChange}
              className="h-4 w-4 text-police-blue focus:ring-police-blue border-gray-300"
            />
            <label htmlFor="theme-dark" className="ml-2 block text-sm text-gray-700">
              Dark
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="radio"
              id="theme-system"
              name="theme"
              value="system"
              checked={formData.theme === 'system'}
              onChange={handleRadioChange}
              className="h-4 w-4 text-police-blue focus:ring-police-blue border-gray-300"
            />
            <label htmlFor="theme-system" className="ml-2 block text-sm text-gray-700">
              System Default
            </label>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <FormGroup>
          <FormLabel htmlFor="language">Language</FormLabel>
          <select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleSelectChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-police-blue focus:border-police-blue"
          >
            {languages.map(language => (
              <option key={language.value} value={language.value}>
                {language.label}
              </option>
            ))}
          </select>
        </FormGroup>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </form>
  );
};

export default PreferencesForm;