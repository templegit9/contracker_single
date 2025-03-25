import React, { useEffect, useState } from 'react';
import { useUI } from '../contexts/UIContext';

function Notification({ message, type = 'success' }) {
  const { hideNotification } = useUI();
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  // Define icon based on notification type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  // Define background color based on notification type
  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900';
      case 'error':
        return 'bg-red-50 dark:bg-red-900';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900';
      default:
        return 'bg-blue-50 dark:bg-blue-900';
    }
  };

  // Define text color based on notification type
  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800 dark:text-green-200';
      case 'error':
        return 'text-red-800 dark:text-red-200';
      case 'warning':
        return 'text-yellow-800 dark:text-yellow-200';
      case 'info':
        return 'text-blue-800 dark:text-blue-200';
      default:
        return 'text-blue-800 dark:text-blue-200';
    }
  };

  // Define border color based on notification type
  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-green-200 dark:border-green-800';
      case 'error':
        return 'border-red-200 dark:border-red-800';
      case 'warning':
        return 'border-yellow-200 dark:border-yellow-800';
      case 'info':
        return 'border-blue-200 dark:border-blue-800';
      default:
        return 'border-blue-200 dark:border-blue-800';
    }
  };

  // Define icon color based on notification type
  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-500 dark:text-green-300';
      case 'error':
        return 'text-red-500 dark:text-red-300';
      case 'warning':
        return 'text-yellow-500 dark:text-yellow-300';
      case 'info':
        return 'text-blue-500 dark:text-blue-300';
      default:
        return 'text-blue-500 dark:text-blue-300';
    }
  };

  // Handle close notification with animation
  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      hideNotification();
    }, 300); // match the transition duration
  };

  // Auto-close notification after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 max-w-md transform transition-transform duration-300 ${isLeaving ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}>
      <div className={`${getBgColor()} ${getTextColor()} ${getBorderColor()} border px-4 py-3 rounded-lg shadow-lg flex items-start`}>
        <div className={`${getIconColor()} mr-3 mt-0.5`}>
          <span className="material-icons">{getIcon()}</span>
        </div>
        <div className="flex-1 pr-2">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button 
          onClick={handleClose}
          className={`ml-2 ${getTextColor()} focus:outline-none hover:opacity-75`}
          aria-label="Close notification"
        >
          <span className="material-icons text-lg">close</span>
        </button>
      </div>
    </div>
  );
}

export default Notification; 