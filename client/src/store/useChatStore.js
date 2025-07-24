import {create} from 'zustand'
import { toast } from 'react-toastify'
import { axiosInstance } from '../lib/axios'

export const useChatStore = create((set)=>({
    messages :[],
    users:[],
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,
    getUser: async () => {
        set({isUserLoading:true});
        try {
            const res = await axiosInstance.get("/messages/users");
            set({users:res.data});
        } catch (error) {
            toast.error(error.messages.data.message);
        }finally{
            set({isUserLoading:false});
        }
    },
    getMessages: async (userId) => {
        set({isMessagesLoading:true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({messages:res.data});
        } catch (error) {
            toast.error(error.response.data.messages);
        }finally{
            set({isMessagesLoading:false});
        }
    },
    setSelectedUser: (selectedUser)=> set({selectedUser}),
}))