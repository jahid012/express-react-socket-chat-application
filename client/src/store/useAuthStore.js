import {create} from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import { toast } from 'react-toastify';
import LoginPage from '../pages/LoginPage.jsx';

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    checkingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    checkAuth: async () =>{
        try {
            const res = await axiosInstance.get('/auth/user/check-auth');
            console.log("Check Auth Response:", res.data);
            if (res.data.user) {
                set({ user: res.data.user, isAuthenticated: true });
            } else {
                set({ user: null, isAuthenticated: false });
            }
        } catch (error) {
            console.log("Error checking authentication:", error);
            set({ user: null, isAuthenticated: false });
            
        }finally {
            set({ checkingAuth: false });
        }
    },
    signup: async (formData) => {
        set({issigningUp: true});
        try {
            const res = await axiosInstance.post('/auth/signup', formData);
            if (res.data.user) {
                set({ user: res.data.user, isAuthenticated: true });
                toast.success("Signup successful!");                
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed");
        }finally {
            set({ isSigningUp: false });
        }
    },
    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout');
            set({ user: null, isAuthenticated: false });
            toast.success("Logged out successfully!");
        } catch (error) {
            console.error("Error during logout:", error);
            toast.error(error.response?.data?.message || "Logout failed");
        }
    },
    login: async (formData) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post('/auth/login', formData);
            if (res.data.user) {
                set({ user: res.data.user, isAuthenticated: true });
                toast.success("Login successful!");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            set({ isLoggingIn: false });
        }
    },
    updateProfile: async (formData) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put('/auth/user/update-profile', formData);
            if (res.data.user) {
                set({ user: res.data.user });
                toast.success("Profile updated successfully!");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Profile update failed");
        }finally {
            set({ isUpdatingProfile: false });
        }
    },
}));