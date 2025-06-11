import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';

const MessageList = ({ messages, loading, typingIndicator }) => {
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading && messages.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="animate-pulse text-gray-500 dark:text-gray-400">
          Loading messages...
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow p-4 overflow-y-auto">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Start a conversation by sending a message below.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}

          {typingIndicator && (
            <div className="flex items-start">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-300 mr-2 flex items-center justify-center">
                <span className="text-sm font-bold">AI</span>
              </div>
              <div className="max-w-[80%] p-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
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

