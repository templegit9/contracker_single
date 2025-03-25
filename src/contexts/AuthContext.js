import React, { createContext, useState, useContext, useEffect } from 'react';
import CryptoJS from 'crypto-js';
import localforage from 'localforage';

// Create the auth context
const AuthContext = createContext();

// Hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}

// Provider component for auth context
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize on mount - check if user is logged in
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Check if there's a stored user in local storage
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          setCurrentUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadUser();
  }, []);

  // Register a new user
  const register = async (name, email, password) => {
    // Check if user already exists
    const existingUsers = await localforage.getItem('users') || [];
    
    if (existingUsers.find(user => user.email === email)) {
      throw new Error('User with this email already exists');
    }
    
    // Hash password for storage
    const passwordHash = CryptoJS.SHA256(password).toString();
    
    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      name,
      email,
      passwordHash,
      createdAt: new Date().toISOString()
    };
    
    // Add user to storage
    await localforage.setItem('users', [...existingUsers, newUser]);
    
    // Create a user object without the password hash
    const userForState = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    };
    
    // Set current user and store in local storage
    setCurrentUser(userForState);
    localStorage.setItem('currentUser', JSON.stringify(userForState));
    
    return userForState;
  };

  // Login an existing user
  const login = async (email, password, rememberMe = false) => {
    // Get existing users
    const existingUsers = await localforage.getItem('users') || [];
    
    // Find user by email
    const user = existingUsers.find(user => user.email === email);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Check password
    const passwordHash = CryptoJS.SHA256(password).toString();
    if (user.passwordHash !== passwordHash) {
      throw new Error('Invalid email or password');
    }
    
    // Create a user object without the password hash
    const userForState = {
      id: user.id,
      name: user.name,
      email: user.email
    };
    
    // Set current user
    setCurrentUser(userForState);
    
    // Store user in local storage if remember me is checked
    if (rememberMe) {
      localStorage.setItem('currentUser', JSON.stringify(userForState));
    }
    
    return userForState;
  };

  // Logout the current user
  const logout = async () => {
    // Clear current user
    setCurrentUser(null);
    
    // Remove from local storage
    localStorage.removeItem('currentUser');
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    if (!currentUser) throw new Error('No authenticated user');
    
    // Get existing users
    const existingUsers = await localforage.getItem('users') || [];
    
    // Find user by id
    const userIndex = existingUsers.findIndex(user => user.id === currentUser.id);
    if (userIndex === -1) throw new Error('User not found');
    
    // Update user data
    const updatedUsers = [...existingUsers];
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      name: profileData.displayName || updatedUsers[userIndex].name,
      photoURL: profileData.photoURL || updatedUsers[userIndex].photoURL,
      updatedAt: new Date().toISOString()
    };
    
    // Save updated users
    await localforage.setItem('users', updatedUsers);
    
    // Update current user state
    const updatedUser = {
      ...currentUser,
      name: profileData.displayName || currentUser.name,
      photoURL: profileData.photoURL || currentUser.photoURL
    };
    
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    return updatedUser;
  };

  // Update password
  const updatePassword = async (currentPassword, newPassword) => {
    if (!currentUser) throw new Error('No authenticated user');
    
    // Get existing users
    const existingUsers = await localforage.getItem('users') || [];
    
    // Find user by id
    const userIndex = existingUsers.findIndex(user => user.id === currentUser.id);
    if (userIndex === -1) throw new Error('User not found');
    
    // Check current password
    const currentPasswordHash = CryptoJS.SHA256(currentPassword).toString();
    if (existingUsers[userIndex].passwordHash !== currentPasswordHash) {
      throw new Error('Current password is incorrect');
    }
    
    // Hash new password
    const newPasswordHash = CryptoJS.SHA256(newPassword).toString();
    
    // Update user password
    const updatedUsers = [...existingUsers];
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      passwordHash: newPasswordHash,
      updatedAt: new Date().toISOString()
    };
    
    // Save updated users
    await localforage.setItem('users', updatedUsers);
    
    return true;
  };

  // Update email
  const updateEmail = async (password, newEmail) => {
    if (!currentUser) throw new Error('No authenticated user');
    
    // Get existing users
    const existingUsers = await localforage.getItem('users') || [];
    
    // Check if new email is already in use
    if (existingUsers.some(user => user.email === newEmail && user.id !== currentUser.id)) {
      throw new Error('Email is already in use by another account');
    }
    
    // Find user by id
    const userIndex = existingUsers.findIndex(user => user.id === currentUser.id);
    if (userIndex === -1) throw new Error('User not found');
    
    // Check password
    const passwordHash = CryptoJS.SHA256(password).toString();
    if (existingUsers[userIndex].passwordHash !== passwordHash) {
      throw new Error('Password is incorrect');
    }
    
    // Update user email
    const updatedUsers = [...existingUsers];
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      email: newEmail,
      updatedAt: new Date().toISOString()
    };
    
    // Save updated users
    await localforage.setItem('users', updatedUsers);
    
    // Update current user state
    const updatedUser = {
      ...currentUser,
      email: newEmail
    };
    
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    return updatedUser;
  };

  // Create demo user if not exists
  useEffect(() => {
    const createDemoUser = async () => {
      if (!isInitialized) return;
      
      const existingUsers = await localforage.getItem('users') || [];
      
      // Check if demo user already exists
      if (!existingUsers.some(user => user.email === 'demo@example.com')) {
        // Create demo user
        const demoUser = {
          id: 'demo_user',
          name: 'Demo User',
          email: 'demo@example.com',
          passwordHash: CryptoJS.SHA256('password').toString(),
          createdAt: new Date().toISOString()
        };
        
        // Add demo user to storage
        await localforage.setItem('users', [...existingUsers, demoUser]);
      }
    };
    
    createDemoUser();
  }, [isInitialized]);

  // Context value
  const value = {
    currentUser,
    isInitialized,
    register,
    login,
    logout,
    updateProfile,
    updatePassword,
    updateEmail
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 