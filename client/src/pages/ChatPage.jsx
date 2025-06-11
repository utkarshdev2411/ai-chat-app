import React, { useState, useEffect } from 'react';
import { useSession } from '../contexts/SessionContext';
import { useAuth } from '../contexts/AuthContext';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import SessionSidebar from '../components/SessionSidebar';

const ChatPage = () => {
  const { user } = useAuth();
  const { 
    currentSessionId, 
    setCurrentSessionId,
    messages, 
    sessions,
    loading, 
    sending,
    error,
    createSession,
    sendMessage,
    deleteSession
  } = useSession();
  const [showSidebar, setShowSidebar] = useState(true);
  const [showError, setShowError] = useState(false);

  // Show error message when error occurs
  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Handle sending a new message
  const handleSendMessage = async (text) => {
    if (!currentSessionId) {
      // Create a new session if none exists
      const newSessionId = await createSession();
      if (newSessionId) {
        await sendMessage(text);
      }
    } else {
      await sendMessage(text);
    }
  };

  // Handle creating a new session
  const handleNewSession = async () => {
    await createSession();
  };

  // Handle session selection
  const handleSelectSession = (sessionId) => {
    setCurrentSessionId(sessionId);
  };

  // Handle session deletion with confirmation
  const handleDeleteSession = async (sessionId) => {
    if (window.confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      await deleteSession(sessionId);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Mobile menu button */}
      <button 
        onClick={() => setShowSidebar(!showSidebar)}
        className="lg:hidden absolute top-4 left-4 z-20 p-2 rounded-md bg-gray-200 dark:bg-gray-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transform transition-transform duration-300 ease-in-out fixed lg:static inset-0 z-10 lg:z-0 lg:h-full ${showSidebar ? 'w-64' : 'w-0'} lg:w-64 flex-shrink-0`}>
        <SessionSidebar
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSelectSession={handleSelectSession}
          onNewSession={handleNewSession}
          onDeleteSession={handleDeleteSession}
        />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold">AI Chat</h1>
          </div>
          
          <div className="flex items-center">
            <div className="mr-2 text-sm">
              {user?.email}
            </div>
            <div 
              className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="User avatar" className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-white">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Error toast */}
        {showError && (
          <div className="absolute top-16 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded shadow-lg">
            {error}
          </div>
        )}

        {/* Messages */}
        <MessageList
          messages={messages}
          loading={loading}
          typingIndicator={sending}
        />

        {/* Message input */}
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={loading || sending}
        />
      </div>
    </div>
  );
};

export default ChatPage;

