import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const MessageBubble = ({ message }) => {
  const { user } = useAuth();
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-300 mr-2 flex items-center justify-center">
          <span className="text-sm font-bold">AI</span>
        </div>
      )}
      
      <div 
        className={`max-w-[80%] p-3 rounded-lg ${isUser 
          ? 'bg-blue-500 text-white rounded-tr-none' 
          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none'}`}
      >
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
        <div className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {isUser && (
        <div 
          className="flex-shrink-0 h-8 w-8 rounded-full ml-2 flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: !user?.avatar ? '#3B82F6' : 'transparent' }}
        >
          {user?.avatar ? (
            <img src={user.avatar} alt="User avatar" className="h-full w-full object-cover" />
          ) : (
            <span className="text-sm font-bold text-white">
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;

