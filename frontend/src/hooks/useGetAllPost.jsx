import { setPosts } from "@/redux/postSlice";
import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"


const useGetAllPost=()=>{
    const dispatch=useDispatch();
    useEffect(()=>{
        const fetchAllPost=async()=>{
            try {
                const res=await axios.get('https://instagram-3-r3kd.onrender.com/api/v1/post/all',{withCredentials:true})
                if(res.data.success){
                   
                    dispatch(setPosts(res.data.posts))

                }
            } catch (error) {
                console.log(error)
                
            }
        }
        fetchAllPost();
    }, [dispatch])
}
export default useGetAllPost