import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Badge } from 'lucide-react'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import SuggestedUsers from './SuggestedUsers'

const RightSidebar = () => {    
  const {user}=useSelector(store=>store.auth)
  return (
    <div className='w-fit my-10 md:block hidden '>
         <div className="flex items-center gap-2">
          <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="post_image"
             className="w-14 h-14 rounded-full" />
             <AvatarFallback>CN</AvatarFallback>
            
          </Avatar>
          </Link>
          
          <div className="flex flex-col items-center gap-3">
          <h1 className='font-semibold text-sm' > <Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
          <span className='text-gray-600 text-sm'>{user?.bio||'Bio here ...'}</span>
          

          </div>
          
        </div>
        <SuggestedUsers/>
      
    </div>
  )
}

export default RightSidebar
