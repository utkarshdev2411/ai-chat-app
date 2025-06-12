import React, { useState, useEffect, useRef } from 'react';
import { useSession } from '../contexts/SessionContext';
import { useAuth } from '../contexts/AuthContext';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import SessionSidebar from '../components/SessionSidebar';
import ScenarioSelector from '../components/ScenarioSelector';
import AnimatedAvatar from '../components/AnimatedAvatar';

const StoryPage = () => {
  const { user } = useAuth();
  const { 
    currentStoryId, 
    setCurrentStoryId,
    currentStory,
    messages, 
    stories,
    scenarios,
    loading, 
    sending,
    error,
    createStory,
    submitAction,
    deleteStory
  } = useSession();
  const [showSidebar, setShowSidebar] = useState(true);
  const [showError, setShowError] = useState(false);
  const [showScenarioSelector, setShowScenarioSelector] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Show error message when error occurs
  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Handle submitting an action
  const handleSubmitAction = async (text, actionType = 'action') => {
    if (!currentStoryId) {
      // Show scenario selector if no story exists
      setShowScenarioSelector(true);
      return;
    }
    await submitAction(text, actionType);
  };

  // Handle creating a new story
  const handleNewStory = () => {
    setShowScenarioSelector(true);
  };

  // Handle scenario selection and story creation
  const handleScenarioSelect = async (scenarioKey, character) => {
    setShowScenarioSelector(false);
    await createStory(scenarioKey, character);
  };

  // Handle story selection
  const handleSelectStory = (storyId) => {
    setCurrentStoryId(storyId);
  };

  // Handle story deletion with confirmation
  const handleDeleteStory = async (storyId) => {
    if (window.confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
      await deleteStory(storyId);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-gray-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-800 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-700 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>
      
      {/* Mobile menu button */}
      <button 
        onClick={() => setShowSidebar(!showSidebar)}
        className="lg:hidden absolute top-4 left-4 z-20 p-3 rounded-xl bg-black bg-opacity-60 hover:bg-opacity-80 border border-gray-700 hover-lift transition-all duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transform transition-all duration-500 ease-out fixed lg:static inset-0 z-10 lg:z-0 lg:h-full ${showSidebar ? 'w-64' : 'w-0'} lg:w-64 flex-shrink-0`}>
        <div className="sidebar h-full relative overflow-auto thin-scrollbar bg-black bg-opacity-80 backdrop-blur-lg border-r border-gray-800">
          <SessionSidebar
            stories={stories}
            currentStoryId={currentStoryId}
            onSelectStory={handleSelectStory}
            onNewStory={handleNewStory}
            onDeleteStory={handleDeleteStory}
          />
        </div>
      </div>

      {/* Main story area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-0">
        {/* Header */}
        <header className="h-16 bg-black bg-opacity-60 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-4 lg:px-6 relative z-10">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-100">
              {currentStory ? currentStory.title : '✨ AI Storytelling'}
            </h1>
            {currentStory && (
              <div className="ml-4 text-sm text-gray-300 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
                {currentStory.character?.name} • {scenarios.find(s => s.key === currentStory.scenario)?.name || currentStory.scenario}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-300 font-medium">
              {user?.email}
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 p-0.5 hover:from-gray-600 hover:to-gray-700 transition-all duration-300">
              <div className="h-full w-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <AnimatedAvatar src={user.avatar} alt="User avatar" className="h-full w-full object-cover" size={32} />
                ) : (
                  <span className="text-sm font-bold text-white">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Error toast */}
        {showError && (
          <div className="absolute top-20 right-4 z-50 bg-black bg-opacity-80 backdrop-blur-md border border-red-500 text-red-300 px-6 py-3 rounded-xl shadow-2xl fade-in-up">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 relative overflow-y-auto thin-scrollbar px-4 py-2">
          <MessageList
            messages={messages}
            loading={loading}
            typingIndicator={sending}
            isStoryMode={true}
          />
          <div ref={messagesEndRef} />
        </div>

        {/* Message input */}
        <div className="relative z-10 bg-black bg-opacity-60 backdrop-blur-md border-t border-gray-800 p-4">
          <MessageInput
            onSubmitAction={handleSubmitAction}
            disabled={loading || sending}
            isStoryMode={true}
          />
        </div>
      </div>
      
      {/* Scenario Selector Modal */}
      {showScenarioSelector && (
        <div className="absolute inset-0 z-50 bg-black bg-opacity-80 backdrop-blur-md flex items-center justify-center">
          <ScenarioSelector
            scenarios={scenarios}
            onSelect={handleScenarioSelect}
            onCancel={() => setShowScenarioSelector(false)}
          />
        </div>
      )}
    </div>
  );
};

export default StoryPage;

