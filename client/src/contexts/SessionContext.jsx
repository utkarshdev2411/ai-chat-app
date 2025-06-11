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
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  // Load sessions list when user is logged in
  useEffect(() => {
    if (user && token) {
      fetchSessions();
    } else {
      setSessions([]);
      setMessages([]);
      setCurrentSessionId(null);
    }
  }, [user, token]);

  // Load current session messages when session changes
  useEffect(() => {
    if (currentSessionId) {
      fetchSessionMessages(currentSessionId);
    } else {
      setMessages([]);
    }
  }, [currentSessionId]);

  // Fetch all sessions for current user
  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/sessions`);
      setSessions(res.data);
      setError(null);

      // If no current session is selected and we have sessions, select the most recent one
      if (!currentSessionId && res.data.length > 0) {
        setCurrentSessionId(res.data[0]._id);
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError(err.response?.data?.message || 'Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for a specific session
  const fetchSessionMessages = async (sessionId) => {
    if (!sessionId) return;
    
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/sessions/${sessionId}`);
      setMessages(res.data.history || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching session messages:', err);
      setError(err.response?.data?.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  // Create a new session
  const createSession = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/sessions`);
      const newSessionId = res.data.sessionId;
      
      // Add to sessions list
      setSessions([{ _id: newSessionId, createdAt: new Date() }, ...sessions]);
      
      // Set as current session
      setCurrentSessionId(newSessionId);
      setMessages([]);
      setError(null);
      
      return newSessionId;
    } catch (err) {
      console.error('Error creating session:', err);
      setError(err.response?.data?.message || 'Failed to create new session');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Send message and get AI response
  const sendMessage = async (text) => {
    if (!currentSessionId || !text.trim()) return;
    
    setSending(true);
    
    try {
      // Optimistically add user message to UI
      const userMessage = {
        role: 'user',
        text: text.trim(),
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, userMessage]);
      
      // Send to API
      const res = await axios.post(
        `${API_URL}/sessions/${currentSessionId}/message`,
        { text: text.trim() }
      );
      
      // Add AI response to messages
      const aiMessage = res.data.aiMessage;
      setMessages(prevMessages => [...prevMessages, aiMessage]);
      setError(null);
      
      return aiMessage;
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.response?.data?.message || 'Failed to send message');
      return null;
    } finally {
      setSending(false);
    }
  };

  // Delete a session
  const deleteSession = async (sessionId) => {
    try {
      await axios.delete(`${API_URL}/sessions/${sessionId}`);
      
      // Remove from sessions list
      setSessions(sessions.filter(session => session._id !== sessionId));
      
      // If it was the current session, select a new one or clear
      if (sessionId === currentSessionId) {
        const remainingSessions = sessions.filter(session => session._id !== sessionId);
        if (remainingSessions.length > 0) {
          setCurrentSessionId(remainingSessions[0]._id);
        } else {
          setCurrentSessionId(null);
          setMessages([]);
        }
      }
      
      setError(null);
      return true;
    } catch (err) {
      console.error('Error deleting session:', err);
      setError(err.response?.data?.message || 'Failed to delete session');
      return false;
    }
  };

  const value = {
    currentSessionId,
    setCurrentSessionId,
    messages,
    sessions,
    loading,
    sending,
    error,
    fetchSessions,
    fetchSessionMessages,
    createSession,
    sendMessage,
    deleteSession
  };

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
};

export default SessionContext;

