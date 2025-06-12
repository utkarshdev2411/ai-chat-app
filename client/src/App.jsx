import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SessionProvider } from './contexts/SessionContext';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PreferencesPage from './pages/PreferencesPage';
import AppPage from './pages/AppPage';
import StoryPage from './pages/ChatPage'; // Renamed to StoryPage internally

function App() {
  return (
    <div className="dark">
      <AuthProvider>
        <Router>
          <Routes>
          {/* Public routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          
          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/preferences" element={<PreferencesPage />} />
            <Route path="/app" element={<AppPage />} />
            <Route path="/chat" element={
              <SessionProvider>
                <StoryPage />
              </SessionProvider>
            } />
          </Route>
        </Routes>
      </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
