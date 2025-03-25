import React, { useState } from 'react';
import { useContent } from '../contexts/ContentContext';
import ContentForm from '../components/ContentForm';
import ContentItems from '../components/ContentItems';

function ContentLibraryPage() {
  const { contentItems, deleteContentItem } = useContent();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Platform names for display
  const PLATFORMS = {
    youtube: 'YouTube',
    servicenow: 'ServiceNow',
    linkedin: 'LinkedIn'
  };

  // Filter content items based on search term
  const filteredContent = searchTerm
    ? contentItems.filter(item => 
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.url?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : contentItems;

  // Sort content by newest first
  const sortedContent = [...filteredContent].sort((a, b) => 
    new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  );

  // Toggle content form
  const toggleContentForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  // Handle delete content item
  const handleDeleteContent = async (id) => {
    if (window.confirm('Are you sure you want to delete this content? This will also remove all engagement data.')) {
      await deleteContentItem(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Content Library</h1>
        <button 
          onClick={toggleContentForm}
          className="btn btn-primary"
        >
          <span className="material-icons mr-1">{isFormOpen ? 'remove' : 'add'}</span>
          {isFormOpen ? 'Close Form' : 'Add Content'}
        </button>
      </div>

      {/* Content form */}
      {isFormOpen && <ContentForm onComplete={() => setIsFormOpen(false)} />}

      {/* Search and filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-icons text-gray-500 dark:text-gray-400 text-lg">search</span>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content list using ContentItems component */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <ContentItems 
          items={sortedContent} 
          searchTerm={searchTerm} 
          onDelete={handleDeleteContent} 
          platforms={PLATFORMS}
          filteredItemsCount={filteredContent.length}
          totalItemsCount={contentItems.length}
        />
      </div>
    </div>
  );
}

export default ContentLibraryPage; 