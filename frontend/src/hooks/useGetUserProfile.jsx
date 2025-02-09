import { setPosts } from "@/redux/postSlice";
import axios from "axios"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { setUserProfile } from "@/redux/authSlice";


const useGetUserProfile=(userId)=>{
    const dispatch=useDispatch();
    //const [userProfile,setUserProfile]=useState(null);
   
    useEffect(()=>{
        const fetchUserProfile=async()=>{
            try {
                const res=await axios.get(`https://instagram-3-r3kd.onrender.com/api/v1/user/${userId}/profile`,{withCredentials:true})
                if(res.data.success){
                   
                    dispatch(setUserProfile(res.data.user))

                }
            } catch (error) {
                console.log(error)
                
            }
        }
        fetchUserProfile();
    }, [userId])
}
export default useGetUserProfile