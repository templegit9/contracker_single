/**
 * API integrations for various platforms
 * 
 * These functions handle the fetching of content information from different platforms.
 * In a real application, these would make actual API calls to the respective platforms.
 * For this demo, they simulate API responses with reasonable delays.
 */

/**
 * Fetch YouTube video information
 * @param {string} videoId - YouTube video ID
 * @param {string} apiKey - YouTube API key
 * @returns {Promise<Object>} - Video information
 */
export async function fetchYouTubeInfo(videoId, apiKey) {
  // In a real app, this would call the YouTube API
  // Example: https://www.googleapis.com/youtube/v3/videos?id={videoId}&key={apiKey}&part=snippet,contentDetails
  
  // Simulate API call with delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if API key is provided
  if (!apiKey) {
    throw new Error('YouTube API key is not configured. Please add it in Settings.');
  }
  
  // Simulate parsing video ID from different URL formats
  if (!videoId) {
    throw new Error('Could not extract video ID from URL');
  }
  
  // Mock response
  return {
    title: `YouTube Video - ${videoId}`,
    description: 'This is a sample description for the YouTube video.',
    publishedDate: new Date().toISOString(),
    duration: '10:30',
    thumbnailUrl: `https://img.youtube.com/vi/${videoId}/0.jpg`
  };
}

/**
 * Fetch ServiceNow article information
 * @param {string} articleId - ServiceNow article ID
 * @param {Object} config - ServiceNow API configuration
 * @returns {Promise<Object>} - Article information
 */
export async function fetchServiceNowInfo(articleId, config) {
  // In a real app, this would call the ServiceNow API
  
  // Simulate API call with delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Check if instance is configured
  if (!config.instance) {
    throw new Error('ServiceNow instance is not configured. Please add it in Settings.');
  }
  
  // Mock response
  return {
    title: `ServiceNow Article - ${articleId}`,
    description: 'This is a sample description for the ServiceNow article.',
    publishedDate: new Date().toISOString(),
    author: 'ServiceNow User'
  };
}

/**
 * Fetch LinkedIn post information
 * @param {string} postId - LinkedIn post ID
 * @param {Object} config - LinkedIn API configuration
 * @returns {Promise<Object>} - Post information
 */
export async function fetchLinkedInInfo(postId, config) {
  // In a real app, this would call the LinkedIn API
  
  // Simulate API call with delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Check if client ID is configured
  if (!config.clientId) {
    throw new Error('LinkedIn API credentials are not configured. Please add them in Settings.');
  }
  
  // Mock response
  return {
    title: `LinkedIn Post - ${postId}`,
    description: 'This is a sample description for the LinkedIn post.',
    publishedDate: new Date().toISOString(),
    author: 'LinkedIn User'
  };
}

/**
 * Extract content ID from a URL based on platform
 * @param {string} url - Content URL
 * @param {string} platform - Platform (youtube, servicenow, linkedin)
 * @returns {string} - Extracted content ID
 */
export function extractContentId(url, platform) {
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
        
        return url;
      
      case 'servicenow':
        // Extract article ID from ServiceNow URL
        return urlObj.pathname.split('/').pop();
      
      case 'linkedin':
        // Extract post ID from LinkedIn URL
        const linkedInMatch = urlObj.pathname.match(/\/posts\/([^\/]+)/);
        if (linkedInMatch) return linkedInMatch[1];
        return urlObj.pathname.split('-').pop();
      
      default:
        return url;
    }
  } catch (error) {
    console.error('Error extracting content ID:', error);
    return url;
  }
} 