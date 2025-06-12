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
  
  // Add state for the settings sidebar
  const [showSettingsSidebar, setShowSettingsSidebar] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-fast');
  const [responseType, setResponseType] = useState('balanced');

  // Available models for demo
  const availableModels = [
    { id: 'deepseek-rational', name: 'Deepseek (Rational)' },
    { id: 'gemini-fast', name: 'Gemini (Fast)' },
    { id: 'claude-precise', name: 'Claude (Precise)' },
    { id: 'llama-creative', name: 'Llama (Creative)' },
    { id: 'mistral-efficient', name: 'Mistral (Efficient)' },
  ];

  // Response types for demo
  const responseTypes = [
    { id: 'exploring', name: 'Exploring', description: 'Provides diverse perspectives and explores multiple angles' },
    { id: 'focused', name: 'Staying to Topic', description: 'Stays strictly on topic with detailed relevant information' },
    { id: 'experimental', name: 'Experimental', description: 'Offers novel viewpoints and creative interpretations' },
    { id: 'balanced', name: 'Balanced', description: 'Balanced mix of creativity and factual information' },
    { id: 'concise', name: 'Concise', description: 'Brief and to-the-point responses' }
  ];

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

      {/* Semi-transparent backdrop for settings - only visible when settings are open */}
      {showSettingsSidebar && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-20"
          onClick={() => setShowSettingsSidebar(false)}
        ></div>
      )}

      {/* Settings Sidebar - slides from right with improved styling */}
      <div className={`${showSettingsSidebar ? 'translate-x-0' : 'translate-x-full'} transform transition-all duration-500 ease-out fixed inset-y-0 right-0 z-30 w-80 flex-shrink-0`}>
        <div className="h-full relative overflow-auto thin-scrollbar bg-black bg-opacity-90 backdrop-blur-lg border-l border-gray-800 p-6 settings-sidebar">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-100">Settings</h3>
            <button 
              onClick={() => setShowSettingsSidebar(false)}
              className="p-2 rounded-lg hover:bg-gray-800 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Model Selection Section */}
          <div className="mb-8">
            <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-3">AI Model</h4>
            <div className="space-y-2">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-gray-200 focus:border-purple-500 transition-all"
              >
                {availableModels.map(model => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Select an AI model based on your preferences
              </p>
            </div>
          </div>
          
          {/* Response Type Section */}
          <div>
            <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-3">Response Style</h4>
            <div className="space-y-2">
              {responseTypes.map(type => (
                <div
                  key={type.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    responseType === type.id
                      ? 'border-purple-500 bg-purple-900 bg-opacity-20'
                      : 'border-gray-700 bg-gray-800 bg-opacity-40 hover:border-gray-600'
                  }`}
                  onClick={() => setResponseType(type.id)}
                >
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      responseType === type.id ? 'bg-purple-500' : 'bg-gray-600'
                    }`}></div>
                    <h5 className="font-medium text-gray-200">{type.name}</h5>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 ml-5">
                    {type.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main story area - ensure it doesn't get covered */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-0">
        {/* Header - MODIFY THIS SECTION to include settings button */}
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
            
            {/* Settings button - integrated into the header */}
            <button 
              onClick={() => setShowSettingsSidebar(!showSettingsSidebar)}
              className="p-2 rounded-lg hover:bg-gray-800 transition-all flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            
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
        <div className="flex-1 relative overflow-y-auto thin-scrollbar px-4 py-2 w-full">
          <div className="max-w-full mx-auto">
            <MessageList
              messages={messages}
              loading={loading}
              typingIndicator={sending}
              isStoryMode={true}
            />
          </div>
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

