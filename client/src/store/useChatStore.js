import {create} from 'zustand'
import { toast } from 'react-toastify'
import { axiosInstance } from '../lib/axios'
import { useAuthStore } from './useAuthStore'

export const useChatStore = create((set,get)=>({
    messages :[],
    users:[],
    selectedUser: null,
    isUserLoading: false,
    onlineUsers: [],
    isMessagesLoading: false,
    getUser: async () => {
        set({isUserLoading:true});
        try {
            const res = await axiosInstance.get("/auth/messages/users");
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
            const res = await axiosInstance.get(`/auth/messages/${userId}`);
            set({messages:res.data});
        } catch (error) {
            toast.error(error.response.data.messages);
        }finally{
            set({isMessagesLoading:false});
        }
    },
    sendMessage: async (messageData) => {
        const {selectedUser, messages} = get();
        try {
            const res = await axiosInstance.post(`/auth/messages/send/${selectedUser._id}`,messageData)
            set({messages:[...messages,res.data]})
        } catch (error) {
            toast.error(error.response.data.message);
        }

    },

    setSelectedUser: (selectedUser)=> set({selectedUser}),

    subscribeToMessages: ()=>{
        const{ selectedUser} = get()
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage",(newMessage)=>{

            const isMessageSendFromSelecteduser = newMessage.senderId !== selectedUser._id;
            if (isMessageSendFromSelecteduser) {
                return;
            }

            set({
                messages: [...get().messages,newMessage],
            })
        })
        
    },
    unSubscribeFromMessage: ()=>{
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    }
}))