import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../components/layout/Layout';
import { Card, Tabs, Alert, Button, Avatar } from '../components/ui';
import ProfileForm from '../components/profile/ProfileForm';
import PreferencesForm from '../components/profile/PreferencesForm';
import SecurityForm from '../components/profile/SecurityForm';
import Breadcrumbs from '../components/ui/Breadcrumbs';
// Import actions (to be implemented)
// import { getProfile, updateProfile, updatePreferences, changePassword } from '../store/actions/profileActions';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector(state => state.auth);
  const { profile, updateSuccess, updateError } = useSelector(state => state.profile || {});
  const [activeTab, setActiveTab] = useState(0);

  // Fetch profile data on component mount
  useEffect(() => {
    // Uncomment when actions are implemented
    // dispatch(getProfile());
  }, [dispatch]);

  // Handle profile update
  const handleProfileUpdate = (profileData) => {
    // Uncomment when actions are implemented
    // dispatch(updateProfile(profileData));
    console.log('Profile update:', profileData);
  };

  // Handle preferences update
  const handlePreferencesUpdate = (preferences) => {
    // Uncomment when actions are implemented
    // dispatch(updatePreferences(preferences));
    console.log('Preferences update:', preferences);
  };

  // Handle password change
  const handlePasswordChange = (passwordData) => {
    // Uncomment when actions are implemented
    // dispatch(changePassword(passwordData));
    console.log('Password change:', passwordData);
  };

  // Mock profile data (remove when connected to Redux)
  const mockProfile = {
    name: 'Officer Singh',
    email: 'officer.singh@police.gov.in',
    department: 'Cybercrime Cell, Delhi Police',
    designation: 'Sub-Inspector',
    rank: 'SI',
    phoneNumber: '+91 9876543210',
    bio: 'Experienced officer specializing in cybercrime investigation with 5 years of field experience.',
    location: 'Delhi',
    profileImage: 'https://via.placeholder.com/150',
    preferences: {
      notifications: {
        email: true,
        inApp: true
      },
      theme: 'system',
      language: 'en'
    }
  };

  // Use mock data until Redux is connected
  const profileData = profile || mockProfile;

  // Tab content
  const tabsContent = [
    {
      label: 'Personal Information',
      content: (
        <ProfileForm 
          profile={profileData} 
          onSubmit={handleProfileUpdate} 
          loading={loading}
        />
      )
    },
    {
      label: 'Preferences',
      content: (
        <PreferencesForm 
          preferences={profileData.preferences} 
          onSubmit={handlePreferencesUpdate}
          loading={loading}
        />
      )
    },
    {
      label: 'Security',
      content: (
        <SecurityForm 
          onSubmit={handlePasswordChange}
          loading={loading}
        />
      )
    }
  ];

  return (
    <Layout>
      <div className="mb-4">
        <Breadcrumbs
          items={[
            { label: 'Home', path: '/' },
            { label: 'Dashboard', path: '/dashboard' },
            { label: 'Profile' }
          ]}
        />
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-heading font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      {error && (
        <div className="mb-6">
          <Alert variant="error" title="Error">
            {error}
          </Alert>
        </div>
      )}

      {updateSuccess && (
        <div className="mb-6">
          <Alert variant="success" title="Success">
            Your profile has been updated successfully.
          </Alert>
        </div>
      )}

      {updateError && (
        <div className="mb-6">
          <Alert variant="error" title="Error">
            {updateError}
          </Alert>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1">
          <Card className="p-6 text-center">
            <div className="flex flex-col items-center">
              <Avatar 
                src={profileData.profileImage} 
                alt={profileData.name} 
                size="xl" 
                className="mb-4"
              />
              <h2 className="text-xl font-medium text-gray-900">{profileData.name}</h2>
              <p className="text-gray-600">{profileData.designation}</p>
              <p className="text-sm text-gray-500">{profileData.department}</p>
              
              <div className="mt-6 w-full">
                <Button variant="outline" fullWidth>
                  Change Photo
                </Button>
              </div>
            </div>
            
            <div className="mt-6 border-t pt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Account Information</h3>
              <div className="text-sm text-left">
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Email</span>
                  <span className="text-gray-900">{profileData.email}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Phone</span>
                  <span className="text-gray-900">{profileData.phoneNumber || 'Not set'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Location</span>
                  <span className="text-gray-900">{profileData.location || 'Not set'}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Profile Content */}
        <div className="lg:col-span-3">
          <Card>
            <Tabs 
              tabs={tabsContent} 
              variant="underline" 
              defaultTab={activeTab}
              onChange={setActiveTab}
            />
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;