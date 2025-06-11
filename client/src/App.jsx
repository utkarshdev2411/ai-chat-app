import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
            AI Chat Application
          </h1>
          <Routes>
            <Route path="/" element={<div className="text-center">Welcome to AI Chat App</div>} />
            {/* More routes will be added as we develop the app */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
