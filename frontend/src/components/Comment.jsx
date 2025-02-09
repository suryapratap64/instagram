import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import React from 'react'
import { AvatarFallback } from './ui/avatar'

const Comment = ({comment}) => {
  return (
    <div className='my-2'>
        <div className='flex gap-3 items-center'>
            <Avatar  >
                <AvatarImage className='rounded-full h-8 w-8' src={comment?.author?.profilePicture}/>
                <AvatarFallback className='rounded-full h-8 w-8'>CN</AvatarFallback>
            </Avatar>
            <h1 className='font-bold text-sm '>{comment?.author.username}<span className='font-normal pl-14'>{comment?.text}</span></h1>
        </div>
      
    </div>
  )
}

export default Comment
