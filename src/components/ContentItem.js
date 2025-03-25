import React from 'react';
import { format } from 'date-fns';

function ContentItem({ 
  item, 
  onDelete = () => {},
  platformNames = {}
}) {
  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Get platform-specific icon
  const getPlatformIcon = (platformId) => {
    switch (platformId) {
      case 'youtube':
        return 'smart_display';
      case 'linkedin':
        return 'work';
      case 'servicenow':
        return 'build';
      default:
        return 'link';
    }
  };

  // Get platform display name
  const getPlatformName = (platformId) => {
    return platformNames[platformId] || platformId;
  };

  // Truncate text if it's too long
  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {item.name || 'Untitled'}
          </h3>
          
          <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="material-icons text-sm mr-1">{getPlatformIcon(item.platform)}</span>
            <span>{getPlatformName(item.platform)}</span>
            <span className="mx-2">•</span>
            <span>Published: {formatDate(item.publishedDate)}</span>
          </div>
          
          {item.description && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {item.description}
            </p>
          )}
          
          <a 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-2 block text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            {truncateText(item.url, 60)}
          </a>
        </div>
        
        <button
          onClick={() => onDelete(item.id)}
          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
          aria-label={`Delete ${item.name}`}
        >
          <span className="material-icons">delete</span>
        </button>
      </div>
      
      {item.platform === 'youtube' && item.duration && (
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <span className="material-icons text-sm mr-1">timer</span>
          <span>Duration: {item.duration}</span>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        Added on: {formatDate(item.createdAt)}
      </div>
    </div>
  );
}

export default ContentItem; 