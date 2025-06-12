import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AnimatedAvatar from './AnimatedAvatar';

const MessageBubble = ({ message, isStoryMode = false }) => {
  const { user } = useAuth();
  const isAI = message.role === 'ai';
  
  if (isStoryMode) {
    if (isAI) {
      // AI Narration - full width, styled as story text
      return (
        <div className="w-full mb-8 fade-in-up">
          <div className="story-bubble glass p-6 rounded-2xl relative overflow-hidden w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-black/5 to-amber-500/5 opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 mr-3 flex items-center justify-center glow-amber">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-amber-300 uppercase tracking-wider">
                  📜 Chronicle
                </span>
                {message.timestamp && (
                  <span className="ml-auto text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded-lg">
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </div>
              <div className="prose-story">
                <p className="text-slate-200 leading-relaxed whitespace-pre-wrap text-lg">
                  {message.text}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    // Don't render user messages
    return null;
  }
  
  // Standard chat mode - only render AI messages
  if (isAI) {
    return (
      <div className="flex w-full mb-4 fade-in-up">
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-slate-600 to-slate-700 mr-2 flex items-center justify-center">
          <span className="text-sm font-bold text-white">AI</span>
        </div>
        
        <div className="w-full glass border border-slate-600 text-slate-200 rounded-lg p-3">
          <p className="whitespace-pre-wrap break-words">{message.text}</p>
          <div className="text-xs mt-1 text-slate-400">
            {message.timestamp && new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    );
  }
  
  // Don't render user messages
  return null;
};

export default MessageBubble;

