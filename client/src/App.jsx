import Navbar from './components/Navbar';
import { Route, Routes, Navigate } from 'react-router';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import { useAuthStore } from './store/useAuthStore';
import { use, useEffect } from 'react';
import {Loader} from 'lucide-react';
import Toaster from 'react-hot-toast';

function App() {
  const { user, isAuthenticated, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [isAuthenticated]);

  console.log("Auth User:", user);
  console.log(isAuthenticated && !user);
  if (isCheckingAuth) 
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin" />
      </div>
    );
  
  return (
    <>


    <Navbar />
    <Routes>
      <Route path="/" element={ user ? <HomePage />:<Navigate to="/login" />} />
      <Route path="/signup" element={!user ? <SignUpPage />:<Navigate to="/login" />} />
      <Route path="/signin" element={!user ? <LoginPage />:<Navigate to="/login" />} />
      <Route path="/settings" element={ <SettingsPage />} />
      <Route path="/profile" element={user ? <ProfilePage />:<Navigate to="/login" />} />
    </Routes>
    
    </>

  );
}

export default App;
