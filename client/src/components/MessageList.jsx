import React from 'react';
import MessageBubble from './MessageBubble';

const MessageList = ({ messages, loading, typingIndicator, isStoryMode = false }) => {
  // Filter out user messages and combine AI messages
  const processedMessages = React.useMemo(() => {
    if (!messages || messages.length === 0) return [];
    
    // Only keep AI messages
    const aiMessages = messages.filter(msg => msg.role === 'ai');
    
    // Return AI messages as is
    return aiMessages;
  }, [messages]);

  return (
    <div className="w-full max-w-full mx-auto space-y-4 py-4">
      {processedMessages && processedMessages.length > 0 ? (
        processedMessages.map((message, index) => (
          <MessageBubble
            key={message.id || index}
            message={message}
            isStoryMode={isStoryMode}
          />
        ))
      ) : (
        <div className="text-center text-gray-500 py-8">
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-pulse flex space-x-2">
                <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium">No messages yet</p>
              <p className="text-sm">Start a conversation to see messages appear here</p>
            </div>
          )}
        </div>
      )}

      {/* Typing indicator */}
      {typingIndicator && (
        <div className="flex items-center space-x-2 pl-4 py-3">
          <div className="flex justify-center">
            <div className="animate-pulse flex space-x-2">
              <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
              <div className="h-2 w-2 bg-gray-400 rounded-full animation-delay-150"></div>
              <div className="h-2 w-2 bg-gray-400 rounded-full animation-delay-300"></div>
            </div>
          </div>
          <span className="text-sm text-gray-500">AI is thinking...</span>
        </div>
      )}
    </div>
  );
};

export default MessageList;

