import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader';
import MessageInput from './MessageInput';
import MessageSkeleton from './skeletons/MessageSkeleton';
import { useAuthStore } from '../store/useAuthStore';
import { formatMessageTime } from '../lib/utils';
import { useRef } from 'react';

const ChatContainer = () => {
  const {messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unSubscribeFromMessage} = useChatStore();
  const {user} = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(()=>{
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unSubscribeFromMessage();

  },[selectedUser._id,getMessages])

  useEffect(()=>{
    if(messageEndRef.current && messages){
        messageEndRef.current.scrollIntoView({behavior:"smooth"});
    }
    
  },[messages])

   if (isMessagesLoading){ 
    
    return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader/>
      <MessageSkeleton />
      <MessageInput />
    </div>
   )};

  return (
    <div className='flex-1 flex flex-col overflow-auth'>
      <ChatHeader/>
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.map((message)=>(
          
          <div key={message._id} className={`chat ${message.senderId == user.id ? "chat-end" : "chat-start" }`}
          ref={messageEndRef}
          >
            <div className='chat-image avatar'>
              <div className='size-10 rounded-full border'>
                <img src={message.senderId === user._id ? user.profilePic|| "/avatar.png" : selectedUser.profilePic || "/avatar.png"} alt="Profile Pic" />
                
              </div>
            </div>
            <div className='chat-header mb-1'>
              <time className='tex-xs opacity-50 ml-1'>
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className='chat-bubble flex flex-col'>
              {
                message.image && (
                  <img
                  src={message.image}
                  alt='Attachment'
                  className='sm:max-w-[200px] rounded-md mb-2'
                  />
                )
              }
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput/>
    </div>
  )
}

export default ChatContainer
