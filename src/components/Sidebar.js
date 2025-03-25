import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar({ isOpen, onClose }) {
  // Navigation items
  const navItems = [
    { to: '/', icon: 'dashboard', label: 'Dashboard' },
    { to: '/content', icon: 'list', label: 'Content Library' },
    { to: '/settings', icon: 'settings', label: 'Settings' },
    { to: '/profile', icon: 'person', label: 'Profile' }
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="px-4 py-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Menu</h2>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white md:hidden"
              >
                <span className="material-icons">close</span>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => `
                      flex items-center px-4 py-3 text-sm rounded-lg 
                      ${isActive 
                        ? 'bg-serviceNowGreen bg-opacity-10 text-serviceNowGreen' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }
                    `}
                    onClick={onClose}
                    end={item.to === '/'} // Only exact match for home
                  >
                    <span className="material-icons mr-3">{item.icon}</span>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <p>&copy; 2023 Platform Tracker</p>
              <p>Version 1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar; 