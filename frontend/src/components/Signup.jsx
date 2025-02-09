import { Label } from "@radix-ui/react-label"; // Assuming you use this somewhere
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner"; // Ensure this import is correct
import axios from "axios"; // Make sure to import axios if it's not imported
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Store } from "lucide-react";
import { useSelector } from "react-redux";

const Signup = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    password: "",
  });

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {user}=useSelector(Store=>Store.auth)

  const SignupHandler = async (e) => {
    e.preventDefault(); // Prevent page refresh
    console.log(input); // For debugging

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message); // Make sure toast is defined
        setInput({
          username: "",
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error);
      // Check if error.response is available before accessing message
      const errorMessage = error.response?.data?.message || "An error occurred";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  useEffect(()=>{
    if(user){
      navigate("/signup")
    }

  },[])

  return (
    <div className="flex items-center w-screen h-screen justify-center bg-gray-200">
      <form
        onSubmit={SignupHandler}
        className="shadow-lg flex flex-col gap-5 p-8"
      >
        <div className="my-4">
        <h1 className="text-center font-bold text-3xl my-4 font-[sans-serif] tracking-wide">Instagram</h1>
          <p>Signup to see photos & videos from your friends</p>
        </div>
        <div>
          <span className="py-2 font-medium"></span>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={input.username}
            onChange={changeEventHandler}
            className= "focus:outline-none h-11 min-w-full pl-3 bg-gray-100 text-2xl flex  text-black"
          />
        </div>
        <div>
          <span className="py-2 font-medium"></span>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={input.email}
            onChange={changeEventHandler}
            className=" focus:outline-none h-11 min-w-full bg-gray-100 pl-3 text-2xl flex  text-black"
          />
        </div>
        <div>
          <span className="py-2 font-medium"></span>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={input.password}
            onChange={changeEventHandler}
            className=" focus:outline-none h-11 min-w-full bg-gray-100 pl-3 text-2xl flex  text-black justify-center "
          />
        </div>
        {loading ? (
          <Button>
            <Loader2 className="mr-2 h-4 w-2 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit">Signup</Button>
        )}
        <span className="text-center">
          Already have an account ?{" "}
          <Link to="/login" className="text-blue-300 hover:text-blue-600">
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default Signup;

// import { Label } from "@radix-ui/react-label";
// import React, { useState } from "react";
// import { Button } from "./button";
// import { toast } from "sonner";
// import axios from "axios";
// const Signup=()=>{
//     const [input,setInput]=useState({
//         username:"",
//         email:"",
//         password:""

//     })
//     const changeEventHandler=(e)=>{
//         setInput({...input,[e.target.name]:e.target.value})
//     }
//     const SignupHandler=async(e)=>{
//         e.preventDefault();
//         //use to stop refesh page
//         console.log(input)
//         try {
//             const res =await axios.post('http://localhost:8000/api/v1/user/register',input,{
//                 headers:{
//                     'Content-Type':'application/json'
//                 },
//                 withCredentials:true
//             });
//             if(res.data.success){
//                 toast.success(res.data.message)
//             }
//         } catch (error) {
//             console.log(error)
//              toast.error(error.response.data.message)

//         }
//     }
//     return (
// <div className="flex items-center w-screen h-screen justify-center bg-blue-500">
//     <form onSubmit={SignupHandler} className="shadow-lg flex flex-col gap-5 p-8">
//         <div className="my-4">
//             <h1 className="text-center font-bold text-xl">LOGO</h1>
//             <p>signup to see photos & videos from your friend </p>
//         </div>
//         <div>
//            <span className="py-2 font-medium">Username</span>
//             <input
//              type="text"
//             name="username"
//             value={input.username}
//             onChange={changeEventHandler}
//             className="focus-visible:ring-transparent my-4 mx-2  bg-blue-200" />
//         </div>
//         <div>
//            <span className="py-2 font-medium">Email</span>
//             <input
//                type="email"
//                name="email"
//                value={input.email}
//                onChange={changeEventHandler}
//             className="focus-visible:ring-transparent my-4 mx-2  bg-blue-200" />
//         </div>
//         <div>
//            <span className="py-2 font-medium">Password</span>
//             <input type="password"

//                name="password"
//                value={input.password}
//                onChange={changeEventHandler}className="focus-visible:ring-transparent my-4 mx-2 bg-blue-200" />
//         </div>
//         <Button type='submit'>Signup</Button>
//     </form>
// </div>
//     )
// }
// export default Signup
