import React, { useEffect } from 'react';
import { useUI } from '../contexts/UIContext';

function Notification({ message, type = 'success' }) {
  const { hideNotification } = useUI();

  // Background and text colors based on notification type
  const bgColorClass = 
    type === 'success' ? 'bg-green-500' : 
    type === 'error' ? 'bg-red-500' : 
    type === 'warning' ? 'bg-yellow-500' : 
    'bg-blue-500';

  // Icon based on notification type
  const icon = 
    type === 'success' ? 'check_circle' : 
    type === 'error' ? 'error' : 
    type === 'warning' ? 'warning' : 
    'info';

  // Dismiss notification on click
  const handleDismiss = () => {
    hideNotification();
  };

  // Auto-dismiss after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      hideNotification();
    }, 3000);

    return () => clearTimeout(timer);
  }, [hideNotification]);

  return (
    <div className={`fixed bottom-4 right-4 ${bgColorClass} text-white px-4 py-2 rounded shadow-lg z-50 flex items-center`}>
      <span className="material-icons mr-2">{icon}</span>
      <div>{message}</div>
      <button 
        onClick={handleDismiss}
        className="ml-3 text-white hover:text-gray-200"
      >
        <span className="material-icons">close</span>
      </button>
    </div>
  );
}

export default Notification; 