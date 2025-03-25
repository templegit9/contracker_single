import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const { darkMode, toggleDarkMode } = useUI();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password, rememberMe);
      navigate('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-md mx-auto p-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Platform Engagement Tracker</h1>
          <p className="text-gray-600 dark:text-gray-400">Track and manage your content performance across platforms</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          {/* Login/Register tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
            <Link 
              to="/login" 
              className="px-4 py-2 border-b-2 border-green-500 text-green-600 dark:text-green-400 font-medium"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="px-4 py-2 text-gray-500 dark:text-gray-400 font-medium"
            >
              Register
            </Link>
          </div>
          
          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="shadow-sm focus:ring focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2"
                required 
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="shadow-sm focus:ring focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2"
                required 
              />
            </div>
            <div className="flex items-center">
              <input 
                id="remember-me" 
                name="remember-me" 
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)} 
                className="h-4 w-4 text-green-600 border-gray-300 rounded" 
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Remember me
              </label>
            </div>
            
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            
            <div>
              <button 
                type="submit" 
                className="w-full btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="material-icons animate-spin mr-2">refresh</span> 
                    Signing in...
                  </>
                ) : (
                  <>
                    <span className="material-icons mr-1">login</span> Sign in
                  </>
                )}
              </button>
            </div>
          </form>
          
          {/* Dark mode toggle in auth screen */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">Dark Mode</span>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  id="dark-mode-toggle" 
                  checked={darkMode}
                  onChange={toggleDarkMode}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer right-0 transform transition-transform duration-200 ease-in" 
                />
                <label 
                  htmlFor="dark-mode-toggle" 
                  className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer"
                >
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Demo account info */}
        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Demo account: demo@example.com / password</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage; 