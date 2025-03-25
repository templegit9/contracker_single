import React, { useState } from 'react';
import { useContent } from '../contexts/ContentContext';
import { useUI } from '../contexts/UIContext';

function ContentForm({ onComplete = () => {} }) {
  const { addContentItem, fetchContentInfo } = useContent();
  const { showNotification } = useUI();
  
  const initialFormState = {
    name: '',
    url: '',
    platform: 'youtube',
    description: '',
    publishedDate: new Date().toISOString().split('T')[0],
    duration: ''
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isDuplicateUrl, setIsDuplicateUrl] = useState(false);
  
  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear the duplicate URL flag when user changes the URL
    if (name === 'url') {
      setIsDuplicateUrl(false);
    }
    
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  
  // Fetch content info from the platform API
  const handleFetchInfo = async () => {
    if (!formData.url || !formData.platform) {
      showNotification('Please enter a URL and select a platform', 'warning');
      return;
    }
    
    setIsFetching(true);
    
    try {
      const contentInfo = await fetchContentInfo(formData.url, formData.platform);
      
      // Update form with fetched data
      setFormData(prevState => ({
        ...prevState,
        name: contentInfo.title || prevState.name,
        description: contentInfo.description || prevState.description,
        publishedDate: contentInfo.publishedDate 
          ? new Date(contentInfo.publishedDate).toISOString().split('T')[0] 
          : prevState.publishedDate,
        duration: contentInfo.duration || prevState.duration
      }));
      
      showNotification('Content information fetched successfully', 'success');
    } catch (error) {
      console.error('Error fetching content info:', error);
      showNotification(error.message || 'Error fetching content information', 'error');
    } finally {
      setIsFetching(false);
    }
  };
  
  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.url || !formData.platform || !formData.name || !formData.publishedDate) {
      showNotification('Please fill in all required fields', 'warning');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await addContentItem(formData);
      
      // Reset form
      setFormData(initialFormState);
      
      // Call onComplete callback
      onComplete();
    } catch (error) {
      console.error('Error adding content item:', error);
      
      if (error.message.includes('already been added')) {
        setIsDuplicateUrl(true);
      }
      
      showNotification(error.message || 'Error adding content', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get appropriate URL placeholder based on platform
  const getUrlPlaceholder = () => {
    switch (formData.platform) {
      case 'youtube':
        return 'https://www.youtube.com/watch?v=videoID';
      case 'servicenow':
        return 'https://www.servicenow.com/blogs/blogpost.html';
      case 'linkedin':
        return 'https://www.linkedin.com/posts/profile_post-activity-123456';
      default:
        return 'https://example.com/content';
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Add Content</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Content URL */}
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Content URL <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <input
                type="url"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                placeholder={getUrlPlaceholder()}
                className={`form-input flex-1 ${isDuplicateUrl ? 'border-red-500 dark:border-red-600' : ''}`}
                required
              />
              <button
                type="button"
                onClick={handleFetchInfo}
                disabled={isFetching || !formData.url}
                className="ml-2 btn btn-secondary"
              >
                {isFetching ? (
                  <>
                    <span className="material-icons animate-spin mr-1">refresh</span>
                    Fetching...
                  </>
                ) : (
                  <>
                    <span className="material-icons mr-1">sync</span>
                    Fetch Info
                  </>
                )}
              </button>
            </div>
            {isDuplicateUrl && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                This URL has already been added
              </p>
            )}
          </div>
          
          {/* Platform */}
          <div>
            <label htmlFor="platform" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Platform <span className="text-red-500">*</span>
            </label>
            <select
              id="platform"
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="youtube">YouTube</option>
              <option value="servicenow">ServiceNow</option>
              <option value="linkedin">LinkedIn</option>
            </select>
          </div>
          
          {/* Content Name/Title */}
          <div className="col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
          
          {/* Description */}
          <div className="col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="form-textarea"
              placeholder="Brief description of the content"
            />
          </div>
          
          {/* Duration (YouTube only) */}
          {formData.platform === 'youtube' && (
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Duration
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., 12:34"
              />
            </div>
          )}
          
          {/* Published Date */}
          <div>
            <label htmlFor="publishedDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Published Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="publishedDate"
              name="publishedDate"
              value={formData.publishedDate}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button 
            type="button"
            onClick={onComplete}
            className="btn btn-secondary mr-2"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? (
              <>
                <span className="material-icons animate-spin mr-1">refresh</span>
                Adding...
              </>
            ) : (
              <>
                <span className="material-icons mr-1">add</span>
                Add Content
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ContentForm; 