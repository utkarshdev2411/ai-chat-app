import React from 'react';

const SessionSidebar = ({ stories, currentStoryId, onSelectStory, onNewStory, onDeleteStory }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const formatScenario = (scenario) => {
    return scenario.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="w-64 bg-gray-100 dark:bg-gray-800 h-full flex flex-col border-r border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={onNewStory}
          className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Adventure
        </button>
      </div>
      
      <div className="flex-grow overflow-y-auto">
        {stories.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No adventures yet.
            <br />
            Start your story!
          </div>
        ) : (
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {stories.map((story) => (
              <li key={story._id}>
                <div 
                  className={`p-3 flex justify-between items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 ${currentStoryId === story._id ? 'bg-purple-100 dark:bg-purple-900/30 border-l-4 border-purple-600' : ''}`}
                  onClick={() => onSelectStory(story._id)}
                >
                  <div className="truncate flex-1 min-w-0">
                    <div className="font-medium truncate text-sm">
                      {story.title || `${story.character?.name}'s Adventure`}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {story.character?.name} • {formatScenario(story.scenario)}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      {formatDate(story.createdAt)}
                    </div>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteStory(story._id);
                    }}
                    className="ml-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 flex-shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          AI Storytelling
        </div>
      </div>
    </div>
  );
};

export default SessionSidebar;

