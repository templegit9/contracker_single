import React, { useEffect, useState } from 'react';
import { useContent } from '../contexts/ContentContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function DashboardPage() {
  const { contentItems, engagementData, fetchEngagementData, getStats } = useContent();
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState({
    totalContent: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    topPlatform: 'none',
    engagementsByPlatform: {}
  });

  // Platform names for display
  const PLATFORMS = {
    youtube: 'YouTube',
    servicenow: 'ServiceNow',
    linkedin: 'LinkedIn'
  };

  // Platform colors
  const PLATFORM_COLORS = {
    youtube: '#FF0000',
    servicenow: '#00c487',
    linkedin: '#0A66C2',
    none: '#6B7280'
  };

  useEffect(() => {
    // Update stats when content or engagement data changes
    setStats(getStats());
  }, [contentItems, engagementData, getStats]);

  // Handle refresh button click
  const handleRefreshData = async () => {
    setIsLoading(true);
    try {
      await fetchEngagementData();
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare data for platform chart
  const platformChartData = {
    labels: Object.keys(stats.engagementsByPlatform).map(platform => PLATFORMS[platform] || platform),
    datasets: [{
      data: Object.values(stats.engagementsByPlatform),
      backgroundColor: Object.keys(stats.engagementsByPlatform).map(platform => PLATFORM_COLORS[platform] || '#6B7280'),
      borderWidth: 0
    }]
  };

  // Prepare data for content chart - top 5 content by views
  const getTopContent = () => {
    // Get the latest engagement data for each content
    const latestEngagementByUrl = {};
    engagementData.forEach(engagement => {
      if (!latestEngagementByUrl[engagement.contentUrl] || 
          new Date(engagement.timestamp) > new Date(latestEngagementByUrl[engagement.contentUrl].timestamp)) {
        latestEngagementByUrl[engagement.contentUrl] = engagement;
      }
    });
    
    // Map engagement data to content items
    const contentWithViews = contentItems.map(content => {
      const normalizedUrl = content.url.toLowerCase()
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/$/, '');
      
      const engagement = latestEngagementByUrl[normalizedUrl] || { views: 0 };
      
      return {
        name: content.name,
        views: engagement.views || 0,
        platform: content.platform
      };
    });
    
    // Sort by views and take top 5
    return contentWithViews.sort((a, b) => b.views - a.views).slice(0, 5);
  };

  const topContent = getTopContent();
  
  const contentChartData = {
    labels: topContent.map(item => truncateText(item.name, 20)),
    datasets: [{
      label: 'Views',
      data: topContent.map(item => item.views),
      backgroundColor: topContent.map(item => PLATFORM_COLORS[item.platform] || '#6B7280'),
      borderWidth: 0
    }]
  };

  // Helper function to truncate text
  function truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <button 
          onClick={handleRefreshData}
          disabled={isLoading}
          className="btn btn-primary"
        >
          {isLoading ? (
            <>
              <span className="material-icons animate-spin mr-1">refresh</span> Refreshing...
            </>
          ) : (
            <>
              <span className="material-icons mr-1">refresh</span> Refresh Data
            </>
          )}
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-md p-3">
              <span className="material-icons text-blue-600 dark:text-blue-300">collections</span>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Content</dt>
                <dd className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalContent}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 rounded-md p-3">
              <span className="material-icons text-green-600 dark:text-green-300">visibility</span>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Views</dt>
                <dd className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalViews.toLocaleString()}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-100 dark:bg-red-900 rounded-md p-3">
              <span className="material-icons text-red-600 dark:text-red-300">favorite</span>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Likes</dt>
                <dd className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalLikes.toLocaleString()}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900 rounded-md p-3">
              <span className="material-icons text-purple-600 dark:text-purple-300">trending_up</span>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Top Platform</dt>
                <dd className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stats.topPlatform !== 'none' ? PLATFORMS[stats.topPlatform] : '-'}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4 dark:text-white">Engagement by Platform</h3>
          <div className="h-64 flex items-center justify-center">
            {Object.keys(stats.engagementsByPlatform).length > 0 ? (
              <Doughnut 
                data={platformChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        color: document.documentElement.classList.contains('dark') ? '#fff' : '#000',
                      }
                    }
                  }
                }}
              />
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No data available</p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
          <h3 className="text-lg font-medium mb-4 dark:text-white">Top Content by Views</h3>
          <div className="h-64 flex items-center justify-center">
            {topContent.length > 0 ? (
              <Bar 
                data={contentChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  indexAxis: 'y',
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    x: {
                      ticks: {
                        color: document.documentElement.classList.contains('dark') ? '#ccc' : '#333',
                      },
                      grid: {
                        color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                      }
                    },
                    y: {
                      ticks: {
                        color: document.documentElement.classList.contains('dark') ? '#ccc' : '#333',
                      },
                      grid: {
                        display: false
                      }
                    }
                  }
                }}
              />
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick stats or summary */}
      {contentItems.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
          <span className="material-icons text-4xl text-gray-400 dark:text-gray-500 mb-2">science</span>
          <h3 className="text-lg font-medium mb-2 dark:text-white">No content yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Add your first content item to start tracking engagement metrics
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default DashboardPage; 