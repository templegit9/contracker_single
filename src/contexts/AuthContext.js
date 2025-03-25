import React, { createContext, useState, useContext, useEffect } from 'react';
import localforage from 'localforage';
import CryptoJS from 'crypto-js';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Load users from local storage
        const savedUsers = await localforage.getItem('users');
        const parsedUsers = savedUsers ? JSON.parse(savedUsers) : [];
        setUsers(parsedUsers);
        
        // Check for remembered login
        const rememberedUser = await localforage.getItem('rememberedUser');
        if (rememberedUser) {
          const user = parsedUsers.find(u => u.id === rememberedUser);
          if (user) {
            setCurrentUser(user);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    loadUserData();
  }, []);

  // Hash password for secure storage
  const hashPassword = (password) => {
    return CryptoJS.SHA256(password).toString();
  };

  // Login user
  const login = async (email, password, rememberMe) => {
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('No user found with that email');
    }
    
    const hashedPassword = hashPassword(password);
    
    if (hashedPassword !== user.password) {
      throw new Error('Incorrect password');
    }
    
    setCurrentUser(user);
    
    if (rememberMe) {
      await localforage.setItem('rememberedUser', user.id);
    }
    
    return user;
  };

  // Register new user
  const register = async (name, email, password) => {
    // Check if email already exists
    if (users.some(u => u.email === email)) {
      throw new Error('Email already in use');
    }
    
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashPassword(password),
      createdAt: new Date().toISOString()
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setCurrentUser(newUser);
    
    // Save to local storage
    await localforage.setItem('users', JSON.stringify(updatedUsers));
    
    return newUser;
  };

  // Logout user
  const logout = async () => {
    setCurrentUser(null);
    await localforage.removeItem('rememberedUser');
  };

  // Update user profile
  const updateProfile = async (data) => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, ...data };
    
    // Update in users array
    const updatedUsers = users.map(user => 
      user.id === currentUser.id ? updatedUser : user
    );
    
    setUsers(updatedUsers);
    setCurrentUser(updatedUser);
    
    // Save to local storage
    await localforage.setItem('users', JSON.stringify(updatedUsers));
    
    return updatedUser;
  };

  // Delete user account
  const deleteAccount = async () => {
    if (!currentUser) return;
    
    // Remove user from users array
    const updatedUsers = users.filter(user => user.id !== currentUser.id);
    
    // Update state and local storage
    setUsers(updatedUsers);
    setCurrentUser(null);
    
    await localforage.setItem('users', JSON.stringify(updatedUsers));
    await localforage.removeItem('rememberedUser');
    
    // Clean up user data
    const userPrefix = `user_${currentUser.id}_`;
    await localforage.removeItem(userPrefix + 'contentItems');
    await localforage.removeItem(userPrefix + 'engagementData');
    await localforage.removeItem(userPrefix + 'apiConfig');
  };

  const value = {
    currentUser,
    isInitialized,
    users,
    login,
    register,
    logout,
    updateProfile,
    deleteAccount,
    hashPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 