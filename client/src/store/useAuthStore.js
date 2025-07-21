import {create} from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import { toast } from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    checkingAuth: true,
    isSigningUp: false,
    checkAuth: async () =>{
        try {
            const res = await axiosInstance.get('/auth/user/check-auth');
            console.log("Check Auth Response:", res.data);
            if (res.data.isAuthenticated) {
                set({ user: res.data, isAuthenticated: true });
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
            console.log("Signup Response:", res.data);
            set({ user: res.data, isAuthenticated: true });
            toast.success("Signup successful!");
        } catch (error) {
            console.error("Error during signup:", error);
            toast.error(error.response?.data?.message || "Signup failed");
        }finally {
            set({ isSigningUp: false });
        }   
    },
}));