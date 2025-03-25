import React from 'react';
import { format } from 'date-fns';
import { useUI } from '../contexts/UIContext';

function ContentItems({ 
  items = [], 
  searchTerm = '', 
  onDelete = () => {},
  platforms = {},
  filteredItemsCount = 0,
  totalItemsCount = 0
}) {
  const { darkMode } = useUI();
  
  // Format the date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };
  
  // Truncate text if it's too long
  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };
  
  // Get platform display name
  const getPlatformName = (platformId) => {
    return platforms[platformId] || platformId;
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
  
  return (
    <div className="mt-6">
      {/* Display filter info */}
      {searchTerm && (
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredItemsCount} of {totalItemsCount} items
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
      )}
      
      {/* Content table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Platform
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Published
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                URL
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {truncateText(item.title || 'Untitled', 40)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <span className="material-icons text-sm mr-1">{getPlatformIcon(item.platform)}</span>
                      {getPlatformName(item.platform)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(item.publishedDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <a 
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {truncateText(item.url, 30)}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => onDelete(item.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      aria-label={`Delete ${item.title}`}
                    >
                      <span className="material-icons">delete</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  {searchTerm ? (
                    <div>
                      <span className="material-icons text-3xl mb-2">search_off</span>
                      <p>No items match your search criteria "{searchTerm}"</p>
                    </div>
                  ) : (
                    <div>
                      <span className="material-icons text-3xl mb-2">inventory_2</span>
                      <p>No content items added yet</p>
                      <p className="mt-1 text-xs">Use the "Add Content" button to add your first item</p>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ContentItems; 