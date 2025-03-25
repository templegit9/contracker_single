import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';

function Header({ onToggleSidebar, onLogout }) {
  const { currentUser } = useAuth();
  const { darkMode, toggleDarkMode } = useUI();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white dark:bg-gray-800 shadow z-10">
      <div className="px-4 py-3 flex justify-between items-center">
        {/* Left side - Menu toggle and logo */}
        <div className="flex items-center">
          <button
            onClick={onToggleSidebar}
            className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white focus:outline-none md:hidden"
          >
            <span className="material-icons">menu</span>
          </button>
          <h1 className="ml-2 md:ml-0 text-xl font-bold text-gray-900 dark:text-white">
            Platform Engagement Tracker
          </h1>
        </div>

        {/* Right side - User menu */}
        <div className="flex items-center">
          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-1 rounded-full text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white focus:outline-none mr-3"
          >
            <span className="material-icons">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* User dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none transition-colors"
            >
              <span>{currentUser?.name || 'User'}</span>
              <span className="material-icons ml-1">
                {dropdownOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
              </span>
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setDropdownOpen(false)}
                >
                  <span className="material-icons mr-1 align-text-bottom text-sm">person</span>
                  Your Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setDropdownOpen(false)}
                >
                  <span className="material-icons mr-1 align-text-bottom text-sm">settings</span>
                  Settings
                </Link>
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onLogout();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <span className="material-icons mr-1 align-text-bottom text-sm">logout</span>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header; 