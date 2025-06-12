import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create the context
const SessionContext = createContext();

// Custom hook to use the session context
export const useSession = () => {
  return useContext(SessionContext);
};

// Provider component
export const SessionProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [currentStoryId, setCurrentStoryId] = useState(null);
  const [currentStory, setCurrentStory] = useState(null);
  const [messages, setMessages] = useState([]);
  const [stories, setStories] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  // Load stories and scenarios when user is logged in
  useEffect(() => {
    if (user && token) {
      fetchStories();
      fetchScenarios();
    } else {
      setStories([]);
      setMessages([]);
      setCurrentStoryId(null);
      setCurrentStory(null);
    }
  }, [user, token]);

  // Load current story messages when story changes
  useEffect(() => {
    if (currentStoryId) {
      fetchStoryMessages(currentStoryId);
    } else {
      setMessages([]);
      setCurrentStory(null);
    }
  }, [currentStoryId]);

  // Fetch all scenarios
  const fetchScenarios = async () => {
    try {
      const res = await axios.get(`${API_URL}/stories/scenarios`);
      setScenarios(res.data);
    } catch (err) {
      console.error('Error fetching scenarios:', err);
      setError(err.response?.data?.message || 'Failed to load scenarios');
    }
  };

  // Fetch all stories for current user
  const fetchStories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/stories`);
      setStories(res.data);
      setError(null);

      // If no current story is selected and we have stories, select the most recent one
      if (!currentStoryId && res.data.length > 0) {
        setCurrentStoryId(res.data[0]._id);
      }
    } catch (err) {
      console.error('Error fetching stories:', err);
      setError(err.response?.data?.message || 'Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a specific story
  const fetchStoryMessages = async (storyId) => {
    if (!storyId) return;
    
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/stories/${storyId}`);
      setCurrentStory(res.data);
      setMessages(res.data.history || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching story messages:', err);
      setError(err.response?.data?.message || 'Failed to load story');
    } finally {
      setLoading(false);
    }
  };

  // Create a new story
  const createStory = async (scenarioKey = 'space-colony', character = { name: 'Commander', role: 'Colony Leader' }) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/stories`, {
        scenarioKey,
        character
      });
      const newStoryId = res.data.sessionId;
      
      // Add to stories list
      const newStory = {
        _id: newStoryId,
        title: res.data.title,
        scenario: scenarioKey,
        character,
        createdAt: res.data.createdAt
      };
      setStories([newStory, ...stories]);
      
      // Set as current story
      setCurrentStoryId(newStoryId);
      setMessages([]);
      setError(null);
      
      return newStoryId;
    } catch (err) {
      console.error('Error creating story:', err);
      setError(err.response?.data?.message || 'Failed to create new story');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Submit action to story
  const submitAction = async (text, actionType = 'action') => {
    if (!currentStoryId || (!text.trim() && actionType !== 'continue')) return;
    
    setSending(true);
    
    try {
      // Don't add user action to UI anymore
      
      // Send to API
      const res = await axios.post(
        `${API_URL}/stories/${currentStoryId}/action`,
        { 
          text: actionType === 'continue' ? 'Continue the story...' : text.trim(),
          actionType
        }
      );
      
      // Get AI story response
      const storyUpdate = res.data.storyUpdate;
      
      // Update messages - combining with previous AI message if there is one
      setMessages(prevMessages => {
        const aiMessages = prevMessages.filter(msg => msg.role === 'ai');
        
        // If there's a previous AI message, append text to it
        if (aiMessages.length > 0) {
          const lastAiMessage = aiMessages[aiMessages.length - 1];
          
          // Create a new message with combined text
          const combinedMessage = {
            ...lastAiMessage,
            text: lastAiMessage.text + "\n\n" + storyUpdate.text,
            timestamp: storyUpdate.timestamp || new Date()
          };
          
          // Replace the last AI message with combined one
          return prevMessages.map(msg => 
            (msg.role === 'ai' && msg.id === lastAiMessage.id) ? combinedMessage : msg
          );
        }
        
        // If no previous AI message, just add the new one
        return [...prevMessages, storyUpdate];
      });
      
      setError(null);
      return storyUpdate;
    } catch (err) {
      console.error('Error submitting action:', err);
      setError(err.response?.data?.message || 'Failed to submit action');
      return null;
    } finally {
      setSending(false);
    }
  };

  // Delete a story
  const deleteStory = async (storyId) => {
    try {
      await axios.delete(`${API_URL}/stories/${storyId}`);
      
      // Remove from stories list
      setStories(stories.filter(story => story._id !== storyId));
      
      // If it was the current story, select a new one or clear
      if (storyId === currentStoryId) {
        const remainingStories = stories.filter(story => story._id !== storyId);
        if (remainingStories.length > 0) {
          setCurrentStoryId(remainingStories[0]._id);
        } else {
          setCurrentStoryId(null);
          setCurrentStory(null);
          setMessages([]);
        }
      }
      
      setError(null);
      return true;
    } catch (err) {
      console.error('Error deleting story:', err);
      setError(err.response?.data?.message || 'Failed to delete story');
      return false;
    }
  };

  // Rename a story
  const renameStory = async (storyId, newTitle) => {
    try {
      const res = await axios.put(`${API_URL}/stories/${storyId}/title`, {
        title: newTitle
      });
      
      // Update stories list
      setStories(stories.map(story => 
        story._id === storyId 
          ? { ...story, title: newTitle }
          : story
      ));
      
      // Update current story if needed
      if (currentStory && currentStory._id === storyId) {
        setCurrentStory({ ...currentStory, title: newTitle });
      }
      
      setError(null);
      return true;
    } catch (err) {
      console.error('Error renaming story:', err);
      setError(err.response?.data?.message || 'Failed to rename story');
      return false;
    }
  };

  const value = {
    // Story management
    currentStoryId,
    setCurrentStoryId,
    currentStory,
    messages,
    stories,
    scenarios,
    loading,
    sending,
    error,
    
    // Actions
    fetchStories,
    fetchScenarios,
    fetchStoryMessages,
    createStory,
    submitAction,
    deleteStory,
    renameStory
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export default SessionContext;
