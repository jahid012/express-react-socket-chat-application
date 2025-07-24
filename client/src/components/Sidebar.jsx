import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'

const Sidebar = () => {
    const {getUser, users,selectedUser, setSelectedUser, isUserLoading} = useChatStore();
    const onlineUsers = [];
    useEffect(()=>{
        getUser()
    },[])

    if (condition) {
        
    }
  return (
    <div>
      Sidebar
    </div>
  )
}

export default Sidebar
