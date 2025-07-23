import Navbar from './components/Navbar';
import { Route, Routes, Navigate } from 'react-router';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignupPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import { useAuthStore } from './store/useAuthStore';
import { use, useEffect } from 'react';
import {Loader} from 'lucide-react';
import Toaster from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore';

function App() {
  const { user, isAuthenticated, checkingAuth, checkAuth } = useAuthStore();
  const { theme} = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [isAuthenticated]);

  if (checkingAuth && !user) 
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin" />
      </div>
    );
  
  return (
    <div data-theme={theme}>
    <Navbar />
    <Routes>
      <Route path="/" element={ user ? <HomePage />:<Navigate to="/login" />} />
      <Route path="/signup" element={!user ? <SignUpPage />:<Navigate to="/" />} />
      <Route path="/login" element={!user ? <LoginPage />:<Navigate to="/" />} />
      <Route path="/settings" element={ <SettingsPage />} />
      <Route path="/profile" element={user ? <ProfilePage />:<Navigate to="/login" />} />
    </Routes>
    
    </div>

  );
}

export default App;
