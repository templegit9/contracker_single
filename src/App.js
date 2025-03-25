import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ContentLibraryPage from './pages/ContentLibraryPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import { useAuth } from './contexts/AuthContext';
import { useUI } from './contexts/UIContext';
import Layout from './components/Layout';

function App() {
  const { currentUser, isInitialized } = useAuth();
  const { darkMode } = useUI();

  // Set up dark mode based on local storage or system preference
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Show a loading state while auth is being initialized
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-300">
          <span className="material-icons animate-spin mr-2">refresh</span>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!currentUser ? <LoginPage /> : <Navigate to="/" />} />
      <Route path="/register" element={!currentUser ? <RegisterPage /> : <Navigate to="/" />} />
      
      <Route element={currentUser ? <Layout /> : <Navigate to="/login" />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/content" element={<ContentLibraryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default App; 