import { setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useGetSuggestedUsers = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            setLoading(true);
            try {
                const res = await axios.get("http://localhost:8000/api/v1/user/suggested",
                     { withCredentials: true })
                     
                     console.log("API Response:", res.data);
                if (res.data.successs) {
                    dispatch(setSuggestedUsers(res.data.users));
                }
            } catch (err) {
                setError(err.message);
                console.error(err);
            } 
        };

        fetchSuggestedUsers();
    }, []); // Removed dispatch from dependency array

    return { loading, error }; // Return loading and error state
};

export default useGetSuggestedUsers;

// import { setPosts } from "@/redux/postSlice";
// import axios from "axios"
// import { useEffect } from "react"
// import { useDispatch } from "react-redux"
// import { setSuggestedUsers } from "@/redux/authSlice";


// const useGetSuggestedUsers=()=>{
//     const dispatch=useDispatch();
//     useEffect(()=>{
//         const fetchSuggestedUsers=async()=>{
//             try {
//                 const res=await axios.get('http://localhost:8000/api/v1/user/suggested',{withCredentials:true})
//                 if(res.data.success){
                   
//                     dispatch(setSuggestedUsers(res.data.users))

//                 }
//             } catch (error) {
//                 console.log(error)
                
//             }
//         }
//         fetchSuggestedUsers();
//     }, [dispatch])
// }
// export default useGetSuggestedUsers