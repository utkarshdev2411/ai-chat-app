import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create the context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Set axios default headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);
  
  // Load user from token if available
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const res = await axios.get(`${API_URL}/auth/profile`);
        setUser(res.data);
        setError(null);
      } catch (err) {
        console.error('Error loading user:', err);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setError('Session expired. Please login again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, [token]);
  
  // Register a new user
  const register = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, { email, password });
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };
  
  // Login user
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token: newToken, ...userData } = res.data;
      
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      setError(null);
      
      return userData;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };
  
  // Logout user
  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }
  };
  
  // Update user preferences
  const updatePreferences = async (preferences) => {
    try {
      if (!user) throw new Error('User not authenticated');
      
      const res = await axios.put(
        `${API_URL}/users/${user.userId}/preferences`,
        preferences
      );
      
      setUser(res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update preferences');
      throw err;
    }
  };
  
  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    updatePreferences,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

