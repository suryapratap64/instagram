import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessage = () => {
    const dispatch = useDispatch();
    const { selectedUser } = useSelector((store) => store.auth);

    useEffect(() => {
        const fetchAllMessage = async () => {
            if (!selectedUser) return; // Prevent fetching if no selected user
            try {
                const res = await axios.get(
                    `https://instagram-3-r3kd.onrender.com/api/v1/message/all/${selectedUser?._id}`,
                    { withCredentials: true }
                );

                if (res.data.success) {
                   
                    dispatch(setMessages(res.data.messages));
                }
            } catch (error) {
                console.error("Error fetching messages:", error.message || error.response?.data);
            }
        };
        fetchAllMessage();
    }, [selectedUser]);
};

export default useGetAllMessage;
