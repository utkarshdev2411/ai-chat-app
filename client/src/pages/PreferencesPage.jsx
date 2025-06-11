import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AnimatedAvatar from '../components/AnimatedAvatar';

// Replace static avatars with animated character options
const AVATAR_OPTIONS = [
  { id: 'avatar1', src: 'https://avatars.dicebear.com/api/avataaars/avatar1.svg', alt: 'Animated Avatar 1' },
  { id: 'avatar2', src: 'https://avatars.dicebear.com/api/bottts/avatar2.svg', alt: 'Animated Avatar 2' },
  { id: 'avatar3', src: 'https://avatars.dicebear.com/api/personas/avatar3.svg', alt: 'Animated Avatar 3' },
  { id: 'avatar4', src: 'https://avatars.dicebear.com/api/micah/avatar4.svg', alt: 'Animated Avatar 4' },
  { id: 'avatar5', src: 'https://avatars.dicebear.com/api/open-peeps/avatar5.svg', alt: 'Animated Avatar 5' },
  { id: 'avatar6', src: 'https://avatars.dicebear.com/api/pixel-art/avatar6.svg', alt: 'Animated Avatar 6' },
];
// Theme options
const THEME_OPTIONS = [
  { id: 'light', name: 'Light', color: '#f9fafb' },
  { id: 'dark', name: 'Dark', color: '#1f2937' },
  { id: 'blue', name: 'Blue', color: '#3b82f6' },
  { id: 'green', name: 'Green', color: '#10b981' },
];

const PreferencesPage = () => {
  const { user, updatePreferences } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || '');
  const [selectedTheme, setSelectedTheme] = useState(user?.theme || 'light');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!selectedAvatar) {
      setErrorMessage('Please select an avatar');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await updatePreferences({
        avatar: selectedAvatar,
        theme: selectedTheme,
      });
      
      // Navigate to app after preferences are set
      navigate('/app');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to update preferences');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Choose your preferences
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Select an avatar and theme before continuing
          </p>
        </div>
        
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{errorMessage}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Avatar selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Select your avatar</h3>
            <div className="grid grid-cols-3 gap-4">
              {AVATAR_OPTIONS.map((avatar) => (
                <div 
                  key={avatar.id}
                  className={`cursor-pointer rounded-full overflow-hidden border-4 ${selectedAvatar === avatar.src ? 'border-blue-500' : 'border-transparent'}`}
                  onClick={() => setSelectedAvatar(avatar.src)}
                >
                  <AnimatedAvatar 
                    src={avatar.src} 
                    alt={avatar.alt} 
                    className="w-full h-auto" 
                    size={80}
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Theme selection */}
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Select your theme</h3>
            <div className="grid grid-cols-4 gap-4">
              {THEME_OPTIONS.map((theme) => (
                <div 
                  key={theme.id}
                  className="flex flex-col items-center"
                >
                  <div 
                    className={`w-12 h-12 rounded-full border-4 ${selectedTheme === theme.id ? 'border-blue-500' : 'border-gray-300'}`}
                    style={{ backgroundColor: theme.color }}
                    onClick={() => setSelectedTheme(theme.id)}
                  ></div>
                  <span className="text-sm text-gray-700 dark:text-gray-300 mt-1">{theme.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {isSubmitting ? 'Saving...' : 'Save preferences'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PreferencesPage;

