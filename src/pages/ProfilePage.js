import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';

function ProfilePage() {
  const { currentUser, updateProfile, updatePassword, updateEmail } = useAuth();
  const { showNotification } = useUI();
  
  // Profile data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  
  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Email change
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  
  // Errors
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  
  // Load user data when component mounts
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.displayName || '');
      setEmail(currentUser.email || '');
      setPhotoURL(currentUser.photoURL || '');
      setNewEmail(currentUser.email || '');
    }
  }, [currentUser]);
  
  // Update profile information
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileError('');
    setIsUpdatingProfile(true);
    
    try {
      await updateProfile({
        displayName: name,
        photoURL: photoURL
      });
      
      showNotification('Profile updated successfully', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfileError(error.message || 'Failed to update profile');
      showNotification('Error updating profile', 'error');
    } finally {
      setIsUpdatingProfile(false);
    }
  };
  
  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    
    // Validate password inputs
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      await updatePassword(currentPassword, newPassword);
      
      // Reset form fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      showNotification('Password changed successfully', 'success');
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordError(error.message || 'Failed to change password');
      showNotification('Error changing password', 'error');
    } finally {
      setIsChangingPassword(false);
    }
  };
  
  // Change email
  const handleChangeEmail = async (e) => {
    e.preventDefault();
    setEmailError('');
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    // Check if new email is different from current
    if (newEmail === currentUser.email) {
      setEmailError('New email must be different from current email');
      return;
    }
    
    setIsChangingEmail(true);
    
    try {
      await updateEmail(emailPassword, newEmail);
      
      // Reset form fields
      setEmailPassword('');
      
      // Update email state
      setEmail(newEmail);
      
      showNotification('Email changed successfully', 'success');
    } catch (error) {
      console.error('Error changing email:', error);
      setEmailError(error.message || 'Failed to change email');
      showNotification('Error changing email', 'error');
    } finally {
      setIsChangingEmail(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 lg:col-span-2">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Profile Information</h2>
          
          <form onSubmit={handleUpdateProfile}>
            {profileError && (
              <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded relative mb-4" role="alert">
                <span className="block sm:inline">{profileError}</span>
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input 
                type="text" 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="shadow-sm focus:ring focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2"
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input 
                type="email" 
                id="email" 
                value={email}
                disabled
                className="shadow-sm bg-gray-100 dark:bg-gray-600 block w-full sm:text-sm border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-md p-2 cursor-not-allowed"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                To change your email, use the Email Change form below.
              </p>
            </div>
            
            <div className="mb-4">
              <label htmlFor="photoURL" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Profile Picture URL
              </label>
              <input 
                type="text" 
                id="photoURL" 
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://example.com/profile-picture.jpg"
                className="shadow-sm focus:ring focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Enter a URL to an image for your profile picture.
              </p>
            </div>
            
            <div className="mt-4">
              <button 
                type="submit"
                disabled={isUpdatingProfile}
                className="btn btn-primary"
              >
                {isUpdatingProfile ? (
                  <>
                    <span className="material-icons animate-spin mr-1">refresh</span> Updating...
                  </>
                ) : (
                  <>
                    <span className="material-icons mr-1">save</span> Update Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Profile Picture Preview */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 lg:col-span-1">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Profile Picture</h2>
          
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mb-4">
              {photoURL ? (
                <img 
                  src={photoURL} 
                  alt={name || 'Profile'} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/128?text=User';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <span className="material-icons text-5xl">account_circle</span>
                </div>
              )}
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{name || 'User'}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{email || 'No email'}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Change Password */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Change Password</h2>
        
        <form onSubmit={handleChangePassword}>
          {passwordError && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{passwordError}</span>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Password
              </label>
              <input 
                type="password" 
                id="current-password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="shadow-sm focus:ring focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2"
              />
            </div>
            
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Password
              </label>
              <input 
                type="password" 
                id="new-password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="shadow-sm focus:ring focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2"
              />
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm New Password
              </label>
              <input 
                type="password" 
                id="confirm-password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="shadow-sm focus:ring focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2"
              />
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={isChangingPassword}
            className="btn btn-primary"
          >
            {isChangingPassword ? (
              <>
                <span className="material-icons animate-spin mr-1">refresh</span> Changing Password...
              </>
            ) : (
              <>
                <span className="material-icons mr-1">lock</span> Change Password
              </>
            )}
          </button>
        </form>
      </div>
      
      {/* Change Email */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Change Email</h2>
        
        <form onSubmit={handleChangeEmail}>
          {emailError && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{emailError}</span>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="new-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                New Email
              </label>
              <input 
                type="email" 
                id="new-email" 
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                className="shadow-sm focus:ring focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2"
              />
            </div>
            
            <div>
              <label htmlFor="email-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Current Password
              </label>
              <input 
                type="password" 
                id="email-password" 
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
                required
                className="shadow-sm focus:ring focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                For security, please enter your current password to change email.
              </p>
            </div>
          </div>
          
          <button 
            type="submit"
            disabled={isChangingEmail}
            className="btn btn-primary"
          >
            {isChangingEmail ? (
              <>
                <span className="material-icons animate-spin mr-1">refresh</span> Changing Email...
              </>
            ) : (
              <>
                <span className="material-icons mr-1">email</span> Change Email
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage; 