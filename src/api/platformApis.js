// Platform-specific API integrations

// Fetch YouTube video information
export async function fetchYouTubeInfo(videoId, apiKey) {
  if (!apiKey) {
    throw new Error('YouTube API key is not configured. Please add an API key in Settings.');
  }
  
  try {
    // Make API call to YouTube Data API
    const videoInfoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${apiKey}`;
    
    const response = await fetch(videoInfoUrl);
    
    if (!response.ok) {
      throw new Error(`YouTube API returned status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      throw new Error('No data found for this YouTube video');
    }
    
    const snippet = data.items[0].snippet;
    const contentDetails = data.items[0].contentDetails;
    
    // Parse ISO 8601 duration format
    let duration = '';
    if (contentDetails && contentDetails.duration) {
      duration = formatYouTubeDuration(contentDetails.duration);
    }
    
    return {
      title: snippet.title,
      publishedDate: new Date(snippet.publishedAt),
      duration: duration
    };
  } catch (error) {
    console.error('Error fetching YouTube data:', error);
    
    // For development/demo, return fallback data
    return {
      title: `YouTube Video: ${videoId}`,
      publishedDate: new Date(),
      duration: '0:00'
    };
  }
}

// Format YouTube ISO 8601 duration to readable format (HH:MM:SS)
function formatYouTubeDuration(isoDuration) {
  const match = isoDuration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  
  if (!match) return '0:00';
  
  const hours = (match[1] && match[1].replace('H', '')) || 0;
  const minutes = (match[2] && match[2].replace('M', '')) || 0;
  const seconds = (match[3] && match[3].replace('S', '')) || 0;
  
  let formatted = '';
  
  if (hours > 0) {
    formatted += `${hours}:`;
    formatted += `${minutes.toString().padStart(2, '0')}:`;
  } else {
    formatted += `${minutes}:`;
  }
  
  formatted += seconds.toString().padStart(2, '0');
  
  return formatted;
}

// Fetch ServiceNow content information
export async function fetchServiceNowInfo(blogId, config) {
  // In a real implementation, you would make an API call to ServiceNow
  try {
    // Check for required config
    if (!config.instance || !config.username || !config.password) {
      throw new Error('ServiceNow API configuration is incomplete');
    }
    
    console.log(`Would fetch ServiceNow info for blog ID: ${blogId}`);
    
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, you would use the config to authenticate and fetch real data
    // For development/demo, return mock data
    return {
      title: `ServiceNow Blog: ${blogId}`,
      publishedDate: new Date()
    };
  } catch (error) {
    console.error('Error fetching ServiceNow data:', error);
    
    // Return fallback data
    return {
      title: `ServiceNow Blog: ${blogId}`,
      publishedDate: new Date()
    };
  }
}

// Fetch LinkedIn content information
export async function fetchLinkedInInfo(postId, config) {
  // In a real implementation, you would use LinkedIn API
  try {
    // Check for required config
    if (!config.clientId || !config.clientSecret) {
      throw new Error('LinkedIn API configuration is incomplete');
    }
    
    console.log(`Would fetch LinkedIn info for post ID: ${postId}`);
    
    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, you would use the config to authenticate and fetch real data
    // For development/demo, return mock data
    return {
      title: `LinkedIn Post: ${postId}`,
      publishedDate: new Date()
    };
  } catch (error) {
    console.error('Error fetching LinkedIn data:', error);
    
    // Return fallback data
    return {
      title: `LinkedIn Post: ${postId}`,
      publishedDate: new Date()
    };
  }
} 