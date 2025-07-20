import {create} from 'zustand';

export const useAuthStore = create((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    isAuthenticated: false,
    setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
    logout: () => set({ user: null, isAuthenticated: false }),
    login: (user) => set({ user, isAuthenticated: true }),
    signup: (user) => set({ user, isAuthenticated: true }),
    updateUser: (user) => set((state) => ({ user: { ...state.user, ...user } })),
    clearUser: () => set({ user: null, isAuthenticated: false }),
    reset: () => set({ user: null, isAuthenticated: false }),
    checkAuth: async () =>{
        try {
            const res = await axiosInstance.get('/auth/check');
            if (res.data.isAuthenticated) {
                set({ user: res.data.user, isAuthenticated: true });
            } else {
                set({ user: null, isAuthenticated: false });
            }
        } catch (error) {
            console.error("Error checking authentication:", error);
            set({ user: null, isAuthenticated: false });
            
        }
    }
}));