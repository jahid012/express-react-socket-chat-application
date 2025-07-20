import Navbar from './components/Navbar';
import { Route, Routes } from 'react-router';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const { authUser } = useAuthStore();
  return (
    <>
    <Navbar />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/signin" element={<LoginPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
    </>

  );
}

export default App;
