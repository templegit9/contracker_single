import React, { createContext, useState, useContext, useEffect } from 'react';
import localforage from 'localforage';
import { useAuth } from './AuthContext';
import { useUI } from './UIContext';
import { fetchYouTubeInfo, fetchServiceNowInfo, fetchLinkedInInfo } from '../api/platformApis';

const ContentContext = createContext();

export function useContent() {
  return useContext(ContentContext);
}

export function ContentProvider({ children }) {
  const { currentUser } = useAuth();
  const { showNotification } = useUI();
  
  const [contentItems, setContentItems] = useState([]);
  const [engagementData, setEngagementData] = useState([]);
  const [apiConfig, setApiConfig] = useState({
    youtube: { apiKey: '' },
    servicenow: { instance: '', username: '', password: '' },
    linkedin: { clientId: '', clientSecret: '' }
  });
  const [isLoading, setIsLoading] = useState(true);
  // Map to lookup content item by URL quickly
  const [urlToContentMap, setUrlToContentMap] = useState({});

  // Load content data when user changes
  useEffect(() => {
    if (currentUser) {
      loadUserData();
    } else {
      // Clear data when logged out
      setContentItems([]);
      setEngagementData([]);
      setApiConfig({
        youtube: { apiKey: '' },
        servicenow: { instance: '', username: '', password: '' },
        linkedin: { clientId: '', clientSecret: '' }
      });
      setUrlToContentMap({});
    }
  }, [currentUser]);

  // Load user-specific data from storage
  const loadUserData = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    
    try {
      const userPrefix = `user_${currentUser.id}_`;
      
      // Load API config
      const savedApiConfig = await localforage.getItem(userPrefix + 'apiConfig');
      if (savedApiConfig) {
        setApiConfig(JSON.parse(savedApiConfig));
      }
      
      // Load content items
      const savedContentItems = await localforage.getItem(userPrefix + 'contentItems');
      if (savedContentItems) {
        const items = JSON.parse(savedContentItems);
        setContentItems(items);
        rebuildUrlContentMap(items);
      }
      
      // Load engagement data
      const savedEngagementData = await localforage.getItem(userPrefix + 'engagementData');
      if (savedEngagementData) {
        setEngagementData(JSON.parse(savedEngagementData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      showNotification('Error loading data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Save data with user-specific prefix
  const saveUserData = async (key, data) => {
    if (!currentUser) return;
    
    const userPrefix = `user_${currentUser.id}_`;
    await localforage.setItem(userPrefix + key, JSON.stringify(data));
  };

  // Rebuild the URL to content map for quick lookups
  const rebuildUrlContentMap = (items = contentItems) => {
    const map = {};
    items.forEach(item => {
      map[normalizeUrl(item.url)] = item.id;
    });
    setUrlToContentMap(map);
  };

  // Add new content item
  const addContentItem = async (contentData) => {
    try {
      const newItem = {
        id: generateId(),
        ...contentData,
        createdAt: new Date().toISOString(),
        lastUpdated: null
      };
      
      const updatedItems = [...contentItems, newItem];
      setContentItems(updatedItems);
      
      // Update the URL map
      setUrlToContentMap({
        ...urlToContentMap,
        [normalizeUrl(newItem.url)]: newItem.id
      });
      
      // Save to storage
      await saveUserData('contentItems', updatedItems);
      
      // Try to fetch initial engagement data
      await fetchEngagementData([newItem]);
      
      showNotification('Content added successfully', 'success');
      return newItem;
    } catch (error) {
      console.error('Error adding content:', error);
      showNotification('Error adding content', 'error');
      throw error;
    }
  };

  // Update existing content item
  const updateContentItem = async (id, updatedData) => {
    try {
      const index = contentItems.findIndex(item => item.id === id);
      
      if (index === -1) {
        throw new Error('Content item not found');
      }
      
      const updatedItem = {
        ...contentItems[index],
        ...updatedData,
        lastUpdated: new Date().toISOString()
      };
      
      const updatedItems = [...contentItems];
      updatedItems[index] = updatedItem;
      
      setContentItems(updatedItems);
      rebuildUrlContentMap(updatedItems);
      
      // Save to storage
      await saveUserData('contentItems', updatedItems);
      
      showNotification('Content updated successfully', 'success');
      return updatedItem;
    } catch (error) {
      console.error('Error updating content:', error);
      showNotification('Error updating content', 'error');
      throw error;
    }
  };

  // Delete content item
  const deleteContentItem = async (id) => {
    try {
      const updatedItems = contentItems.filter(item => item.id !== id);
      setContentItems(updatedItems);
      rebuildUrlContentMap(updatedItems);
      
      // Remove related engagement data
      const contentItem = contentItems.find(item => item.id === id);
      if (contentItem) {
        const normalizedUrl = normalizeUrl(contentItem.url);
        const updatedEngagementData = engagementData.filter(data => 
          data.contentUrl !== normalizedUrl
        );
        setEngagementData(updatedEngagementData);
        await saveUserData('engagementData', updatedEngagementData);
      }
      
      // Save content items to storage
      await saveUserData('contentItems', updatedItems);
      
      showNotification('Content deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting content:', error);
      showNotification('Error deleting content', 'error');
      throw error;
    }
  };

  // Update API configuration
  const updateApiConfig = async (updatedConfig) => {
    try {
      const newConfig = { ...apiConfig, ...updatedConfig };
      setApiConfig(newConfig);
      await saveUserData('apiConfig', newConfig);
      showNotification('API configuration saved', 'success');
      return newConfig;
    } catch (error) {
      console.error('Error updating API config:', error);
      showNotification('Error saving API configuration', 'error');
      throw error;
    }
  };

  // Fetch content info from respective platforms
  const fetchContentInfo = async (url, platform) => {
    try {
      const contentId = extractContentId(url, platform);
      
      switch (platform) {
        case 'youtube':
          return await fetchYouTubeInfo(contentId, apiConfig.youtube.apiKey);
        case 'servicenow':
          return await fetchServiceNowInfo(contentId, apiConfig.servicenow);
        case 'linkedin':
          return await fetchLinkedInInfo(contentId, apiConfig.linkedin);
        default:
          throw new Error(`Unknown platform: ${platform}`);
      }
    } catch (error) {
      console.error('Error fetching content info:', error);
      throw error;
    }
  };

  // Fetch engagement data for all content items or specific ones
  const fetchEngagementData = async (itemsToFetch = null) => {
    if (!currentUser) return;
    
    setIsLoading(true);
    
    try {
      const itemsToProcess = itemsToFetch || contentItems;
      
      if (itemsToProcess.length === 0) {
        return;
      }
      
      // Create a timestamp for this fetch
      const timestamp = new Date().toISOString();
      const newEngagementEntries = [];
      
      // Process each content item
      for (const item of itemsToProcess) {
        try {
          // In a real app, we would fetch from actual APIs
          // Here we'll just simulate
          const stats = await simulateApiCall(item);
          
          // Create engagement data entry
          const engagementEntry = {
            contentUrl: normalizeUrl(item.url),
            platform: item.platform,
            views: stats.views,
            likes: stats.likes,
            comments: stats.comments,
            watchTimeHours: stats.watchTimeHours,
            timestamp
          };
          
          newEngagementEntries.push(engagementEntry);
        } catch (error) {
          console.error(`Error fetching engagement for ${item.url}:`, error);
        }
      }
      
      // Add new entries to engagement data
      const updatedEngagementData = [...engagementData, ...newEngagementEntries];
      setEngagementData(updatedEngagementData);
      
      // Save to storage
      await saveUserData('engagementData', updatedEngagementData);
      
      showNotification('Engagement data refreshed', 'success');
    } catch (error) {
      console.error('Error fetching engagement data:', error);
      showNotification('Error refreshing engagement data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate API call to get engagement stats
  const simulateApiCall = async (contentItem) => {
    // Add a small delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Get existing data for this content
    const existingData = engagementData.find(data => 
      data.contentUrl === normalizeUrl(contentItem.url)
    );
    
    // Generate random data or increment existing
    const baseViews = existingData ? existingData.views : Math.floor(Math.random() * 1000);
    const baseLikes = existingData ? existingData.likes : Math.floor(baseViews * 0.1);
    const baseComments = existingData ? existingData.comments : Math.floor(baseViews * 0.02);
    const baseWatchTime = existingData ? existingData.watchTimeHours : Math.floor(baseViews * 0.05);
    
    // Increment with some random growth
    return {
      views: baseViews + Math.floor(Math.random() * 50),
      likes: baseLikes + Math.floor(Math.random() * 5),
      comments: baseComments + Math.floor(Math.random() * 2),
      watchTimeHours: baseWatchTime + Math.random().toFixed(2)
    };
  };

  // Export data
  const exportData = async () => {
    try {
      if (!currentUser) return null;
      
      const exportData = {
        contentItems,
        engagementData,
        apiConfig,
        exportDate: new Date().toISOString(),
        user: {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email
        }
      };
      
      return exportData;
    } catch (error) {
      console.error('Error exporting data:', error);
      showNotification('Error exporting data', 'error');
      throw error;
    }
  };

  // Import data
  const importData = async (data) => {
    try {
      if (!currentUser || !data) return;
      
      // Validate imported data has the right structure
      if (!data.contentItems || !data.engagementData) {
        throw new Error('Invalid import data format');
      }
      
      // Set the imported data
      setContentItems(data.contentItems);
      setEngagementData(data.engagementData);
      
      // Import API config if present
      if (data.apiConfig) {
        setApiConfig(data.apiConfig);
      }
      
      // Rebuild URL to content map
      rebuildUrlContentMap(data.contentItems);
      
      // Save to storage
      await saveUserData('contentItems', data.contentItems);
      await saveUserData('engagementData', data.engagementData);
      if (data.apiConfig) {
        await saveUserData('apiConfig', data.apiConfig);
      }
      
      showNotification('Data imported successfully', 'success');
    } catch (error) {
      console.error('Error importing data:', error);
      showNotification('Error importing data', 'error');
      throw error;
    }
  };

  // Helper functions
  const normalizeUrl = (url) => {
    try {
      // Remove protocol, www, and trailing slashes for consistent comparison
      return url.toLowerCase()
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/$/, '');
    } catch (e) {
      return url;
    }
  };

  const extractContentId = (url, platform) => {
    try {
      const urlObj = new URL(url);
      
      switch (platform) {
        case 'youtube':
          // Extract video ID from various YouTube URL formats
          const videoId = urlObj.searchParams.get('v');
          if (videoId) return videoId;
          
          if (urlObj.hostname === 'youtu.be') {
            return urlObj.pathname.substring(1);
          }
          
          if (urlObj.pathname.includes('/embed/')) {
            return urlObj.pathname.split('/embed/')[1].split('/')[0];
          }
          
          return url.split('/').pop();
        
        case 'servicenow':
          // Extract blog ID (last part of path)
          return urlObj.pathname.split('/').pop();
        
        case 'linkedin':
          // Extract post ID
          const linkedInMatch = urlObj.pathname.match(/\/posts\/([^\/]+)/);
          if (linkedInMatch) return linkedInMatch[1];
          return urlObj.pathname.split('-').pop();
        
        default:
          return url;
      }
    } catch (e) {
      console.error('Error extracting content ID:', e);
      return url;
    }
  };

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // Get stats for dashboard
  const getStats = () => {
    // Calculate total content
    const totalContent = contentItems.length;
    
    // Get the latest engagement data for each content
    const latestEngagementByUrl = {};
    engagementData.forEach(engagement => {
      if (!latestEngagementByUrl[engagement.contentUrl] || 
          new Date(engagement.timestamp) > new Date(latestEngagementByUrl[engagement.contentUrl].timestamp)) {
        latestEngagementByUrl[engagement.contentUrl] = engagement;
      }
    });
    
    // Calculate total engagements
    let totalViews = 0;
    let totalLikes = 0;
    let totalComments = 0;
    
    // Count engagements by platform
    const engagementsByPlatform = {
      youtube: 0,
      servicenow: 0,
      linkedin: 0
    };
    
    Object.values(latestEngagementByUrl).forEach(engagement => {
      totalViews += engagement.views;
      totalLikes += engagement.likes;
      totalComments += engagement.comments;
      
      if (engagementsByPlatform[engagement.platform] !== undefined) {
        engagementsByPlatform[engagement.platform] += engagement.views;
      }
    });
    
    // Find top platform
    let topPlatform = 'none';
    let maxViews = 0;
    
    for (const [platform, views] of Object.entries(engagementsByPlatform)) {
      if (views > maxViews) {
        maxViews = views;
        topPlatform = platform;
      }
    }
    
    return {
      totalContent,
      totalViews,
      totalLikes,
      totalComments,
      topPlatform,
      engagementsByPlatform
    };
  };

  const value = {
    contentItems,
    engagementData,
    apiConfig,
    isLoading,
    urlToContentMap,
    addContentItem,
    updateContentItem,
    deleteContentItem,
    updateApiConfig,
    fetchContentInfo,
    fetchEngagementData,
    exportData,
    importData,
    getStats,
    normalizeUrl,
    extractContentId
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
} 