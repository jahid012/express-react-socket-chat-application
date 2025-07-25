import {create} from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import { toast } from 'react-toastify';
import LoginPage from '../pages/LoginPage.jsx';
import {io} from 'socket.io-client';

const BASE_URL = "http://localhost:5001";

export const useAuthStore = create((set, get) => ({
    user: null,
    isAuthenticated: false,
    checkingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,
    checkAuth: async () =>{
        try {
            const res = await axiosInstance.get('/auth/user/check-auth');
            if (res.data.user) {
                set({ user: res.data.user, isAuthenticated: true });
                get().connectSocket();
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
                get().connectSocket();
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
            get().disconnectSocket();
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
                get().connectSocket();
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
    connectSocket: ()=>{
        const { user } = get();
        if (!user || get().socket?.connected) return;
        console.log('connected');

        const socket = io(BASE_URL,{
            query:{
                userId: user.id
            }
        });
        socket.connect();
        set({socket:socket});
        socket.on("getOnlineUser",(userIds)=>{
            set({onlineUsers:userIds})
        })
    },
    disconnectSocket:()=>{
        if(get().socket?.connected) get().socket.disconnect();
    }
}));