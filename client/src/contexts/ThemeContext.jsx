import { createContext, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth();
  
  // Apply theme based on user preference
  useEffect(() => {
    if (!user || !user.theme) return;
    
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('theme-light', 'theme-dark', 'theme-blue', 'theme-green');
    
    // Add selected theme class
    root.classList.add(`theme-${user.theme}`);
    
    // Update dark mode for Tailwind
    if (user.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [user]);
  
  return (
    <ThemeContext.Provider value={{ currentTheme: user?.theme || 'light' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;

