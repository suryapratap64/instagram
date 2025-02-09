import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { readFileAsDataURL } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice"; 


const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const dispatch = useDispatch(); 
   const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const {posts}=useSelector(store=>store.post);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
const {user}=useSelector(store=>store.auth)
  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const createPostHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(); // Corrected the constructor
      formData.append("caption", caption);
      if (imagePreview) formData.append("image", file);

      setLoading(true);
     
      const res = await axios.post(
        'https://instagram-3-r3kd.onrender.com/api/v1/post/addpost', 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Fixed header typo
          },
          withCredentials: true
        });


      if (res.data.success) {
        dispatch(setPosts([res.data.post,...posts]))
        toast.success(res.data.message);
        setOpen(false);  // Optionally close the dialog after successful post
      }

    } catch (error) {
      // Improved error handling
    if (error.response) {
      toast.error(error.response.data.message || 'Error occurred');
    } else if (error.request) {
      toast.error('No response received from server. Please check your connection.');
    } else {
      toast.error('Error: ' + error.message);
    }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg  p-6 bg-white rounded-lg shadow-lg" onInteractOutside={() => setOpen(false)}>
        <DialogTitle className="text-center font-semibold">
          Create new post
        </DialogTitle>
        <DialogDescription>
          Share your thoughts 
        </DialogDescription>

        <div className="flex gap-5 items-center">
          <Avatar className="h-10 w-10 border-2 border-black rounded-full overflow-hidden ">
            <AvatarImage src={user?.profilePicture} alt="img" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xs">{user?.username}</h1>
            <span className="text-gray-500 font-semibold text-xs">
              BIO HERE ...
            </span>
          </div>
        </div>

        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent border-none"
          placeholder="write a caption.."
        />

        {imagePreview && (
          <div className="w-full h-64 items-center justify-center ">
            <img
              src={imagePreview}
              alt="preview_img"
              className="object-cover h-full w-full rounded-md"
            />
          </div>
        )}

        <input ref={imageRef} type="file" className="hidden" onChange={fileChangeHandler} />
        <Button
          onClick={() => imageRef.current.click()}
          className="w-fit mx-auto bg-blue-400 hover:bg-blue-800"
        >
          Select from computer
        </Button>

        {imagePreview && (
          loading ? (
            <Button disabled className="w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button onClick={createPostHandler} type="submit" className="w-full">
              Post
            </Button>
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;

// import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
// import React, { useRef, useState } from "react";
// import { DialogHeader } from "./ui/dialog";
// import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
// import { Textarea } from "./ui/textarea";
// import { Button } from "./ui/button";
// import { readFileAsDataURL } from "@/lib/utils";
// import { Loader2 } from "lucide-react";
// import { toast } from "sonner";
// import axios from "axios";

// const CreatePost = ({ open, setOpen }) => {
//   const imageRef = useRef();
//   const[file,setFile]=useState("");
//   const [caption,setCaption]=useState("");
//   const [imagePreview,SetImagePreview]=useState("");
//   const[loading,setLoading]=useState(false)
//   const fileChangeHandler=async(e)=>{
//     const file=e.target.files?.[0];
//     if(file){
//         setFile(file);
//         const dataUrl=await readFileAsDataURL(file);
//          SetImagePreview(dataUrl);

//     }

//   }
//   const createPostHandler = async (e) => {
//     //e.preventDefault();

//     try {
//       const formData=new FormData();
// formData.append("caption",caption);
// if(imagePreview) formData.append("image",file)
// setLoading(true)
// const res=await axios.post('http://localhost:8000/api/v1/post/addpost',formData,{
//     Headers:{
//         'Content-Type':'/multipart/form-data'
//     },
//     withCredentials:true
// });
// if(res.data.success){
//     toast.success(res.data.message)
//     setOpen(false);
// }
       
//     } catch (error) {
// toast.error(error.response.data.message);

//     }
//     finally{
//         setLoading(false)
//     }
//   };
//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg p-6 bg-white rounded-lg shadow-lg" onInteractOutside={() => setOpen(false)}>
//       <DialogTitle className="text-center font-semibold">
//           Create new post
//         </DialogTitle>
//         <DialogDescription>
//           Share your thoughts and add an image to create a new post.
//         </DialogDescription>

//         {/* <DialogHeader className="text-center font-semibold">
//           Create new post
//         </DialogHeader> */}

//         <div className="flex gap-3 items-center">
//           <Avatar>
//             <AvatarImage src="" alt="img" />
//             <AvatarFallback>CN</AvatarFallback>
//           </Avatar>
//           <div>
//             <h1 className="font-semibold text-xs">Username</h1>
//             <span className="text-gray-500 font-semibold text-xs">
//               BIO HERE ...
//             </span>
//           </div>
//         </div>
//         <Textarea value={caption} onChange={(e)=>setCaption(e.target.value)} 
//           className="focus-visible:ring-transparent border-none"
//           placeholder="write a caption.."
//         />
//         {
//             imagePreview &&(
//                 <div className="w-full h-64 items-center justify-center ">
//                     <img src={imagePreview}
//                      alt="preview_img" className="object-cover h-full w-full rounded-md" />
//                 </div>
//             )
//         }
//         <input ref={imageRef} type="file" className="hidden" onChange={fileChangeHandler} />
//         <Button
//           onClick={() => imageRef.current.click()}
//           className="w-fit mx-auto bg-blue-400 hover:bg-blue-800"
//         >
//           {" "}
//           select from computer
//         </Button>
//         {
//             imagePreview && (
//                 loading ? (
//                     <Button>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
//                         Please wait
//                     </Button>
//                 ):(
//                     <Button  onClick={createPostHandler} type="submit" className="w-full">Post</Button>
//                 )
//             )
//         }
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CreatePost;
