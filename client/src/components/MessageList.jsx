import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';

const MessageList = ({ messages, loading, typingIndicator, isStoryMode = false }) => {
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingIndicator]);

  if (loading && messages.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">
          {isStoryMode ? 'Loading your story...' : 'Loading messages...'}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow p-4 overflow-y-auto">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-gray-500 dark:text-gray-400">
            {isStoryMode ? (
              <>
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-lg mb-2">Your adventure awaits!</p>
                <p className="text-sm">Start a new story or continue an existing one.</p>
              </>
            ) : (
              <>
                <p className="text-lg mb-2">No messages yet</p>
                <p className="text-sm">Start a conversation!</p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} isStoryMode={isStoryMode} />
          ))}

          {typingIndicator && (
            <div className="flex items-start">
              {!isStoryMode && (
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-300 mr-2 flex items-center justify-center">
                  <span className="text-sm font-bold">AI</span>
                </div>
              )}
              <div className={`max-w-[80%] p-3 rounded-lg ${
                isStoryMode 
                  ? 'bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none'
              }`}>
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                    <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
                  </div>
                  {isStoryMode && (
                    <span className="text-xs">
                      Weaving the tale...
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default MessageList;

