import React, { createContext, useState, useContext, useEffect } from 'react';

const UIContext = createContext();

export function useUI() {
  return useContext(UIContext);
}

export function UIProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Initialize dark mode from local storage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedDarkMode === 'true') {
      setDarkMode(true);
    } else if (savedDarkMode === 'false') {
      setDarkMode(false);
    } else if (prefersDarkMode) {
      // If no saved preference, use system preference
      setDarkMode(true);
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Show a notification
  const showNotification = (message, type = 'success', duration = 3000) => {
    setNotification({ message, type });
    
    if (duration > 0) {
      setTimeout(() => {
        setNotification(null);
      }, duration);
    }
  };

  // Hide notification
  const hideNotification = () => {
    setNotification(null);
  };

  const value = {
    darkMode,
    toggleDarkMode,
    sidebarOpen,
    toggleSidebar,
    notification,
    showNotification,
    hideNotification
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
} 