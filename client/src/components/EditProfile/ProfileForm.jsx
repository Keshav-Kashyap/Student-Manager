import React, { useState, useEffect } from 'react';
import ProfileHeader from './ProfileHeader';
import TabNavigation from './TabNavigation';
import PersonalInfoForm from './PersonalInfoForm';
import SecurityForm from './SecurityForm';
import SubmitButton from './SubmitButton';
import toast from 'react-hot-toast';

const ProfileForm = ({ 
  formData, 
  profileImage, 
  onInputChange, 
  onImageChange, 
  isCreateMode, 
  profile,
  onSubmit,
  isLoading 
}) => {
  const [activeTab, setActiveTab] = useState('personal');

  // Debug the activeTab state
  useEffect(() => {
    console.log('Active tab changed to:', activeTab);
  }, [activeTab]);

  const renderActiveForm = () => {
    console.log('Current active tab:', activeTab);
    
    if (activeTab === 'personal') {
      return (
        <PersonalInfoForm 
          key="personal-form"
          formData={formData} 
          onChange={onInputChange} 
          isCreateMode={isCreateMode} 
        />
      );
    }
    
    if (activeTab === 'security') {
      return (
        <SecurityForm 
          key="security-form"
          formData={formData} 
          onChange={onInputChange} 
          isCreateMode={isCreateMode} 
        />
      );
    }
    
    return (
      <PersonalInfoForm 
        key="default-form"
        formData={formData} 
        onChange={onInputChange} 
        isCreateMode={isCreateMode} 
      />
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <ProfileHeader 
        name={formData.name || profile?.name || (isCreateMode ? 'New User' : 'User')}
        email={formData.email || profile?.email || 'user@example.com'}
        profileImage={profileImage}
        onImageChange={onImageChange}
        isCreateMode={isCreateMode}
      />

      <TabNavigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isCreateMode={isCreateMode}
      />

      <form onSubmit={onSubmit} className="space-y-6">
        <div key={activeTab}>
          {renderActiveForm()}
        </div>
        <SubmitButton 
          loading={isLoading}
          isCreateMode={isCreateMode}
        />
      </form>
    </div>
  );
};

export default ProfileForm;