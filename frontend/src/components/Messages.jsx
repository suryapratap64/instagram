import useGetAllMessage from '@/hooks/useGetAllMessage'
import useGetRTM from '@/hooks/useGetRTM'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'
import { useSelector } from 'react-redux'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'

const Messages = ({selectedUser}) => {
  useGetRTM();
  useGetAllMessage();

  const {messages}=useSelector(store=>store.chat)
  const {user}=useSelector(store=>store.auth)
  return (
    <div className='overflow-y-auto flex-1 p-4'>
      <div className='flex justify-center'>
        <div className='flex flex-col items-center justify-center'>
        <Avatar>
  <AvatarImage className='w-14 h-14 rounded-full' src={selectedUser?.profilePicture} alt="profile"/>
  <AvatarFallback>CV</AvatarFallback>
</Avatar>
<span>{selectedUser?.username}</span>
<Link to={`/profile/${selectedUser?._id}`}><Button className="h-8 my-2" variant
="secondary">View profile</Button></Link>

        </div>

      </div>
      <div>
        {
            messages && messages.map((msg)=>
            {
              return(
                <div className={`flex ${msg.senderId===user?._id ? 'justify-end':'justify-start'}`}>
                  <div className={`p-2 rounded-lg max-w-xs break-words ${msg.senderId===user?._id ? 'bg-blue-500':'bg-gray-200 text-black'}`}>
                  {msg.message}
                  </div>
               
                </div>
              )
            })

        }
      
      </div>
      
    </div>
  )
}

export default Messages
