import React, { useState, useRef, useEffect } from 'react';

const MessageInput = ({ onSendMessage, onSubmitAction, disabled, isStoryMode = false }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '40px'; // Reset height
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + 'px';
    }
  }, [message]);

  const handleSubmit = (e, actionType = 'action') => {
    e.preventDefault();
    if (isStoryMode) {
      if ((message.trim() || actionType === 'continue') && !disabled) {
        onSubmitAction(message, actionType);
        setMessage('');
      }
    } else {
      if (message.trim() && !disabled) {
        onSendMessage(message);
        setMessage('');
      }
    }
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (isStoryMode && !disabled) {
      onSubmitAction('', 'continue');
    }
  };

  const handleKeyDown = (e) => {
    // Submit on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (isStoryMode) {
    return (
      <div className="glass border-t border-purple-500/30 p-6 relative">
        {/* Ambient glow effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent opacity-50"></div>
        
        <div className="relative z-10">
          {/* Continue Story Button */}
          <div className="mb-4">
            <button
              onClick={handleContinue}
              className="btn-primary w-full px-6 py-4 text-white font-bold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center hover-lift glow-purple"
              disabled={disabled}
            >
              {disabled ? (
                <span className="flex items-center">
                  <div className="typing-dots mr-3">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  Weaving the tale...
                </span>
              ) : (
                <span className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  ✨ Continue the Chronicle
                </span>
              )}
            </button>
          </div>
          
          {/* Custom Action Input */}
          <form onSubmit={handleSubmit} className="flex items-end space-x-4">
            <div className="flex-grow relative">
              <label className="block text-sm font-medium text-amber-300 mb-2">
                🎭 What do you do?
              </label>
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your character's action or decision..."
                className="w-full p-4 glass border border-purple-500/30 rounded-2xl focus:outline-none focus:border-purple-400 text-slate-200 placeholder-slate-400 resize-none overflow-hidden transition-all duration-300"
                rows="1"
                disabled={disabled}
              />
            </div>
            <button
              type="submit"
              className="btn-secondary px-6 py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover-lift flex items-center justify-center min-w-[120px]"
              disabled={!message.trim() || disabled}
            >
              {disabled ? (
                <div className="typing-dots">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                <span className="flex items-center font-bold">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Act
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Standard chat mode (fallback)
  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto w-full">
      <div className="flex items-end border rounded-lg bg-gray-900 border-gray-700 overflow-hidden focus-within:ring-1 focus-within:ring-gray-500">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={isStoryMode ? "What do you want to do next?" : "Type a message..."}
          rows="1"
          className="flex-1 px-4 py-3 bg-transparent border-none resize-none focus:ring-0 text-gray-200 placeholder-gray-500 focus:outline-none"
          style={{ minHeight: '50px', maxHeight: '150px' }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="h-10 px-4 mr-2 mb-2 rounded-md bg-gray-800 text-gray-200 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span className="mr-1">Send</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
