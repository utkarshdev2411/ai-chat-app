import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AnimatedAvatar from './AnimatedAvatar';

const MessageBubble = ({ message, isStoryMode = false }) => {
  const { user } = useAuth();
  const isUser = message.role === 'user';
  const isAI = message.role === 'ai';
  
  if (isStoryMode) {
    if (isAI) {
      // AI Narration - full width, styled as story text
      return (
        <div className="w-full mb-6">
          <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-lg">
            <div className="flex items-center mb-2">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-amber-500 mr-2 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-xs font-medium text-amber-700 dark:text-amber-300 uppercase tracking-wide">
                Story
              </span>
              <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="prose prose-amber dark:prose-invert max-w-none">
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                {message.text}
              </p>
            </div>
          </div>
        </div>
      );
    } else if (isUser) {
      // User Action - styled differently based on input type
      const isContinue = message.inputType === 'continue';
      return (
        <div className="flex w-full mb-4 justify-end">
          <div className={`max-w-[70%] p-3 rounded-lg ${
            isContinue 
              ? 'bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-200'
              : 'bg-blue-500 text-white'
          } rounded-tr-none`}>
            <div className="flex items-center mb-1">
              <span className="text-xs font-medium uppercase tracking-wide opacity-75">
                {isContinue ? 'Continue' : 'Action'}
              </span>
            </div>
            <p className="whitespace-pre-wrap break-words text-sm">
              {message.text}
            </p>
            <div className={`text-xs mt-1 opacity-75`}>
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
          <div 
            className="flex-shrink-0 h-8 w-8 rounded-full ml-2 flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: !user?.avatar ? '#3B82F6' : 'transparent' }}
          >
            {user?.avatar ? (
              <AnimatedAvatar src={user.avatar} alt="User avatar" className="h-full w-full object-cover" size={32} />
            ) : (
              <span className="text-sm font-bold text-white">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            )}
          </div>
        </div>
      );
    }
  }
  
  // Standard chat mode
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
            <AnimatedAvatar src={user.avatar} alt="User avatar" className="h-full w-full object-cover" size={32} />
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

