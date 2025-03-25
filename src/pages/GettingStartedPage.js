import React from 'react';
import { Link } from 'react-router-dom';

function GettingStartedPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Getting Started</h1>
        <Link to="/" className="btn btn-primary">
          <span className="material-icons mr-1">dashboard</span>
          Go to Dashboard
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Welcome to the Platform Engagement Tracker</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          This application helps you track and analyze engagement metrics for your content across different platforms including YouTube, ServiceNow, and LinkedIn.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="material-icons text-blue-500 dark:text-blue-300 mr-2">info</span>
              <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200">Demo Account</h3>
            </div>
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              You can log in using the demo account:<br />
              <strong>Email:</strong> demo@example.com<br />
              <strong>Password:</strong> password
            </p>
          </div>

          <div className="flex-1 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="material-icons text-green-500 dark:text-green-300 mr-2">settings</span>
              <h3 className="text-lg font-medium text-green-800 dark:text-green-200">API Configuration</h3>
            </div>
            <p className="text-green-700 dark:text-green-300 text-sm">
              For full functionality, configure the API settings in the <Link to="/settings" className="underline">Settings page</Link>. However, the app works with mock data even without API keys.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Quick Start Guide</h2>
        
        <div className="space-y-4">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 h-10 w-10">
              <span className="text-green-600 dark:text-green-300 font-bold">1</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Add Your Content</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Go to the <Link to="/content" className="text-blue-600 dark:text-blue-400 hover:underline">Content Library</Link> page and click "Add Content" to add your YouTube videos, ServiceNow articles, or LinkedIn posts.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 h-10 w-10">
              <span className="text-green-600 dark:text-green-300 font-bold">2</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">View Your Dashboard</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                After adding content, go to the <Link to="/" className="text-blue-600 dark:text-blue-400 hover:underline">Dashboard</Link> to see engagement metrics like views, likes, and comments across all your content.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 h-10 w-10">
              <span className="text-green-600 dark:text-green-300 font-bold">3</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Configure API Settings</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                For real API integration, visit the <Link to="/settings" className="text-blue-600 dark:text-blue-400 hover:underline">Settings</Link> page to add your API keys for each platform.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 h-10 w-10">
              <span className="text-green-600 dark:text-green-300 font-bold">4</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Refresh Engagement Data</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                On the Dashboard, use the "Refresh Data" button to fetch the latest engagement metrics for all your content.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Available Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="material-icons text-green-600 dark:text-green-400 mr-2">dashboard</span>
              <h3 className="text-md font-medium text-gray-900 dark:text-white">Dashboard Analytics</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              View engagement metrics across all platforms with visual charts and statistics.
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="material-icons text-green-600 dark:text-green-400 mr-2">list</span>
              <h3 className="text-md font-medium text-gray-900 dark:text-white">Content Library</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Manage all your content in one place with a searchable, filterable list.
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="material-icons text-green-600 dark:text-green-400 mr-2">auto_graph</span>
              <h3 className="text-md font-medium text-gray-900 dark:text-white">Performance Tracking</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Track views, likes, comments, and other platform-specific metrics.
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="material-icons text-green-600 dark:text-green-400 mr-2">cloud_download</span>
              <h3 className="text-md font-medium text-gray-900 dark:text-white">Data Import/Export</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Import and export your data for backup or analysis in other tools.
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="material-icons text-green-600 dark:text-green-400 mr-2">dark_mode</span>
              <h3 className="text-md font-medium text-gray-900 dark:text-white">Dark Mode</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Toggle between light and dark themes for comfortable viewing in any environment.
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <span className="material-icons text-green-600 dark:text-green-400 mr-2">account_circle</span>
              <h3 className="text-md font-medium text-gray-900 dark:text-white">User Profiles</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Manage your account settings, change password, and update profile information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GettingStartedPage; 