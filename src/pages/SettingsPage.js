import React, { useState } from 'react';
import { useContent } from '../contexts/ContentContext';
import { useUI } from '../contexts/UIContext';

function SettingsPage() {
  const { apiConfig, updateApiConfig, exportData, importData } = useContent();
  const { showNotification } = useUI();
  
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importFile, setImportFile] = useState(null);
  
  // YouTube settings
  const [youtubeApiKey, setYoutubeApiKey] = useState(apiConfig.youtube.apiKey || '');
  
  // ServiceNow settings
  const [serviceNowInstance, setServiceNowInstance] = useState(apiConfig.servicenow.instance || '');
  const [serviceNowUsername, setServiceNowUsername] = useState(apiConfig.servicenow.username || '');
  const [serviceNowPassword, setServiceNowPassword] = useState(apiConfig.servicenow.password || '');
  
  // LinkedIn settings
  const [linkedInClientId, setLinkedInClientId] = useState(apiConfig.linkedin.clientId || '');
  const [linkedInClientSecret, setLinkedInClientSecret] = useState(apiConfig.linkedin.clientSecret || '');

  // Save API configuration
  const handleSaveApiConfig = async () => {
    try {
      const updatedConfig = {
        youtube: {
          apiKey: youtubeApiKey
        },
        servicenow: {
          instance: serviceNowInstance,
          username: serviceNowUsername,
          password: serviceNowPassword
        },
        linkedin: {
          clientId: linkedInClientId,
          clientSecret: linkedInClientSecret
        }
      };
      
      await updateApiConfig(updatedConfig);
    } catch (error) {
      console.error('Error saving API configuration:', error);
      showNotification('Error saving API configuration', 'error');
    }
  };

  // Export data
  const handleExportData = async () => {
    setIsExporting(true);
    
    try {
      const data = await exportData();
      
      if (!data) {
        throw new Error('No data to export');
      }
      
      // Convert to JSON string
      const jsonString = JSON.stringify(data, null, 2);
      
      // Create blob and download link
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create temporary download link
      const link = document.createElement('a');
      link.href = url;
      link.download = `content-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      
      // Click the link to trigger download
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showNotification('Data exported successfully', 'success');
    } catch (error) {
      console.error('Error exporting data:', error);
      showNotification('Error exporting data', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle file selection for import
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImportFile(file);
  };

  // Import data
  const handleImportData = async () => {
    if (!importFile) {
      showNotification('Please select a file to import', 'warning');
      return;
    }
    
    setIsImporting(true);
    
    try {
      // Read file content
      const fileContent = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsText(importFile);
      });
      
      // Parse JSON
      const importedData = JSON.parse(fileContent);
      
      // Validate data structure
      if (!importedData.contentItems || !importedData.engagementData) {
        throw new Error('Invalid import file format');
      }
      
      // Import data
      await importData(importedData);
      
      // Reset file input
      setImportFile(null);
      document.getElementById('import-file').value = '';
      
      showNotification('Data imported successfully', 'success');
    } catch (error) {
      console.error('Error importing data:', error);
      showNotification(error.message || 'Error importing data', 'error');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      </div>

      {/* API Configuration */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">API Configuration</h2>
        
        {/* YouTube API */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">YouTube API</h3>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="mb-4">
              <label htmlFor="youtube-api-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                YouTube API Key
              </label>
              <input 
                type="text" 
                id="youtube-api-key" 
                value={youtubeApiKey}
                onChange={(e) => setYoutubeApiKey(e.target.value)}
                className="shadow-sm focus:ring focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2"
                placeholder="Your YouTube API Key"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Required to fetch video information from YouTube. Create one in the{' '}
                <a 
                  href="https://console.developers.google.com/apis/credentials"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Google Cloud Console
                </a>.
              </p>
            </div>
            <div>
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2">Status:</span>
                <span className={`badge ${youtubeApiKey ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                  {youtubeApiKey ? 'Configured' : 'Not Configured'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* ServiceNow API */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">ServiceNow API</h3>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="servicenow-instance" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Instance URL
                </label>
                <input 
                  type="text" 
                  id="servicenow-instance" 
                  value={serviceNowInstance}
                  onChange={(e) => setServiceNowInstance(e.target.value)}
                  className="shadow-sm focus:ring focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2"
                  placeholder="your-instance.service-now.com"
                />
              </div>
              <div>
                <label htmlFor="servicenow-username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Username
                </label>
                <input 
                  type="text" 
                  id="servicenow-username" 
                  value={serviceNowUsername}
                  onChange={(e) => setServiceNowUsername(e.target.value)}
                  className="shadow-sm focus:ring focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2"
                  placeholder="ServiceNow username"
                />
              </div>
              <div>
                <label htmlFor="servicenow-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input 
                  type="password" 
                  id="servicenow-password" 
                  value={serviceNowPassword}
                  onChange={(e) => setServiceNowPassword(e.target.value)}
                  className="shadow-sm focus:ring focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2"
                  placeholder="ServiceNow password"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2">Status:</span>
                <span className={`badge ${serviceNowInstance && serviceNowUsername ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                  {serviceNowInstance && serviceNowUsername ? 'Configured' : 'Not Configured'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* LinkedIn API */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">LinkedIn API</h3>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="linkedin-client-id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Client ID
                </label>
                <input 
                  type="text" 
                  id="linkedin-client-id" 
                  value={linkedInClientId}
                  onChange={(e) => setLinkedInClientId(e.target.value)}
                  className="shadow-sm focus:ring focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2"
                  placeholder="LinkedIn Client ID"
                />
              </div>
              <div>
                <label htmlFor="linkedin-client-secret" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Client Secret
                </label>
                <input 
                  type="password" 
                  id="linkedin-client-secret" 
                  value={linkedInClientSecret}
                  onChange={(e) => setLinkedInClientSecret(e.target.value)}
                  className="shadow-sm focus:ring focus:ring-green-500 focus:border-green-500 block w-full sm:text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md p-2"
                  placeholder="LinkedIn Client Secret"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2">Status:</span>
                <span className={`badge ${linkedInClientId && linkedInClientSecret ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                  {linkedInClientId && linkedInClientSecret ? 'Configured' : 'Not Configured'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <button 
            onClick={handleSaveApiConfig}
            className="btn btn-primary"
          >
            <span className="material-icons mr-1">save</span> Save API Configuration
          </button>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Data Management</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Export */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">Export Data</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Export all your content and engagement data as a JSON file. You can import this file later or use it as a backup.
            </p>
            <button 
              onClick={handleExportData}
              disabled={isExporting}
              className="btn btn-primary"
            >
              {isExporting ? (
                <>
                  <span className="material-icons animate-spin mr-1">refresh</span> Exporting...
                </>
              ) : (
                <>
                  <span className="material-icons mr-1">download</span> Export Data
                </>
              )}
            </button>
          </div>
          
          {/* Import */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">Import Data</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Import previously exported data. This will merge with your existing data.
            </p>
            <div className="mb-3">
              <input 
                type="file" 
                id="import-file" 
                accept=".json"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 dark:text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-medium
                  file:bg-blue-50 file:text-blue-600
                  dark:file:bg-blue-900 dark:file:text-blue-200
                  hover:file:bg-blue-100 dark:hover:file:bg-blue-800"
              />
            </div>
            <button 
              onClick={handleImportData}
              disabled={isImporting || !importFile}
              className="btn btn-primary"
            >
              {isImporting ? (
                <>
                  <span className="material-icons animate-spin mr-1">refresh</span> Importing...
                </>
              ) : (
                <>
                  <span className="material-icons mr-1">upload</span> Import Data
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage; 