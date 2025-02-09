import { DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
//import { DialogTitle, DialogDescription, VisuallyHidden } from "@radix-ui/react-dialog"; // Ensure you import these components
import React, { useEffect, useState } from "react";
import { Dialog } from "@radix-ui/react-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";

import Comment from "./Comment";
import { toast } from "sonner";
import axios from "axios";
import { setPosts } from "@/redux/postSlice";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector((store) => store.post);
  const [comment, setComment] = useState([]);
  const dispatch = useDispatch();
  

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments || []); // Set to an empty array if comments is undefined
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value; // Capture the input value
    setText(inputText.trim() ? inputText : ""); // Set the text or clear it
  };

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `https://instagram-3-r3kd.onrender.com/api/v1/post/${selectedPost?._id}/comment`,
        { text }, // Send the comment text in the POST body
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);
        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id
            ? { ...p, comments: updatedCommentData }
            : p
        );

        dispatch(setPosts(updatedPostData));

        toast.success(res.data.message);
        setText("");
        setOpen(false);
      }
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
    
  };

  // const open=props.open;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
       onInteractOutside={() => setOpen(true)}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full  max-w-lg  p-6 rounded-lg bg-white shadow-lg"
      >
        <div >
          <div className="flex flex-1">
            <div className="w-1/2">
              <img
                src={selectedPost?.image}
                alt="post_img"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            <div className="w-1/2 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex gap-3 pl-2 items-center">
                  <Link>
                    <Avatar>
                      <AvatarImage className='rounded-full h-8 w-8' src={selectedPost?.author?.profilePicture} />
                      <AvatarFallback>
                      {selectedPost?.author?.username}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link className="font-semibold text-xs">   {selectedPost?.author?.username}</Link>
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <MoreHorizontal className="cursor-pointer" />
                  </DialogTrigger>
                  <DialogContent className="flex flex-col items-center text-sm text-center">
                    <div className="cursor-pointer w-full text-red-400 font-bold">
                      Unfollow
                    </div>
                    <div>Add to favorites</div>
                  </DialogContent>
                </Dialog>
              </div>
              <hr />
              <div className="flex-1 overflow-y-auto max-h-96 p-4">
                {comment && comment.length > 0 ? (
                  comment.map((comment) => (
                    <Comment key={comment._id} comment={comment} />
                  ))
                ) : (
                  <p>No comments yet.</p>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <input
                    onChange={changeEventHandler}
                    value={text}
                    type="text"
                    placeholder="Add a comment.."
                    className="w-full outline-none text-sm border border-gray-100 p-2 rounded"
                  />
                  <Button
                    disabled={!text.trim()}
                    onClick={sendMessageHandler}
                    variant="outline" className="text-white"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
