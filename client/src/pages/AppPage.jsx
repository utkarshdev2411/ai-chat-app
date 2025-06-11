import { useAuth } from '../contexts/AuthContext';

const AppPage = () => {
  const { user, logout } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Chat App</h1>
          <div className="flex items-center space-x-4">
            {user?.avatar && (
              <img 
                src={user.avatar} 
                alt="User avatar" 
                className="w-8 h-8 rounded-full"
              />
            )}
            <button 
              onClick={logout}
              className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Chat interface will be implemented here in Module 4 & 5
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AppPage;

