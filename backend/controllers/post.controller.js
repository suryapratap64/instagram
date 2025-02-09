import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;

        if (!image) return res.status(400).json({ message: 'Image required' });

        // Optimize the image
        const optimizedImageBuffer = await sharp(image.buffer)
            .resize({ width: 800, height: 800, fit: 'inside' })
            .toFormat('jpeg', { quality: 80 })
            .toBuffer();

        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString('base64')}`;
        const cloudResponse = await cloudinary.uploader.upload(fileUri);

        const post = await Post.create({
            caption,
            image: cloudResponse.secure_url,
            author: authorId
        });

        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }

        await post.populate({ path: 'author', select: '-password' });

        return res.status(201).json({
            message: 'New post added',
            post,
            success: true,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong', success: false });
    }
};
export const addNewReel = async (req, res) => {
    try {
        const { caption } = req.body;
        const video = req.file;  // Expecting a video file
        const authorId = req.id;

        if (!video) return res.status(400).json({ message: 'Video required' });

        // Upload video to Cloudinary
        const cloudResponse = await cloudinary.uploader.upload(video.path, {
            resource_type: 'video', // Important: Tell Cloudinary it's a video
            folder: 'reels', // Optional: Store videos in a separate folder
            format: 'mp4', // Convert to MP4 for better compatibility
        });

        // Create a new Reel (post with video)
        const reel = await Post.create({
            caption,
            image: cloudResponse.secure_url, // Save video URL in the image field
            author: authorId,
            type: 'reel', // Add a type field to differentiate from normal posts
        });

        // Update user with the new reel
        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(reel._id);
            await user.save();
        }

        await reel.populate({ path: 'author', select: '-password' });

        return res.status(201).json({
            message: 'New reel added',
            reel,
            success: true,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Something went wrong', success: false });
    }
};



export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate({ path: 'author', select: 'username profilePicture' })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: { path: 'author', select: 'username profilePicture' }
            });

        return res.status(200).json({
            posts,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong', success: false });
    }
};


export const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({ author: authorId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'comments',
                sort: { createdAt: -1 },
                populate: { path: 'author', select: 'username profilePicture' }
            });

        return res.status(200).json({
            posts,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong', success: false });
    }
};

export const likePost = async (req, res) => {

    try {
        const likeKarneWalaUserKiId = req.id;
        const userId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        await post.updateOne({ $addToSet: { likes: userId } });
        await post.save();
        //impomentation for real time notification 
        const user =await User.findById(likeKarneWalaUserKiId).select('username profilePicture')
        const postOwnerId=post.author.toString();
        if(postOwnerId!==likeKarneWalaUserKiId){
            //emit notification
            const notification={
                type:'like',
                userId:'likeKarneWalaUserKiId',
                userDetails:user,
                postId,
                message:'your post was liked'
            }
            const postOwnerSocketId=getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification',notification)

        }

        return res.status(200).json({ message: 'Post liked', success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong', success: false });
    }
};

export const dislikePost = async (req, res) => {
    try {
        const userId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        await post.updateOne({ $pull: { likes: userId } });
        await post.save();
        //implimentation for real time notification 

        const user =await User.findById(userId).select('username profilePicture')
        const postOwnerId=post.author.toString();
        if(postOwnerId!==userId){
            //emit notification
            const notification={
                type:'dislike',
                userId:'userId',
                userDetails:user,
                postId,
                message:'your post was liked'
            }
            const postOwnerSocketId=getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit('notification',notification)

        }

        return res.status(200).json({ message: 'Post disliked', success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong', success: false });
    }
};

export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.id;
        const { text } = req.body;

        if (!text) return res.status(400).json({ message: 'Text is required', success: false });

        const post = await Post.findById(postId);
        const comment = await Comment.create({ text, author: userId, post: postId });

        await comment.populate({ path: 'author', select: 'username profilePicture' });

        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({
            message: 'Comment added',
            comment,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong', success: false });
    }
};

export const getCommentsOfPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await Comment.find({ post: postId }).populate('author', 'username profilePicture');

        if (!comments) return res.status(404).json({ message: 'No comments found', success: false });

        return res.status(200).json({ success: true, comments });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong', success: false });
    }
};

export const deletePost = async (req, res) => {
    try {
       
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ message: 'Post not found', success: false });
        if (post.author.toString() !== authorId) return res.status(403).json({ message: 'Unauthorized' });

        // Delete post
        await Post.findByIdAndDelete(postId);

        // Remove post ID from user's posts array
        const user = await User.findById(authorId);
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        // Delete associated comments
        await Comment.deleteMany({ post: postId });

        return res.status(200).json({ message: 'Post deleted', success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong', success: false });
    }
};

export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.id;
        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ message: 'Post not found', success: false });

        const user = await User.findById(userId);

        if (user.bookmarks.includes(post._id)) {
            // Post already bookmarked, remove it
            await user.updateOne({ $pull: { bookmarks: post._id } });
            await user.save();

            return res.status(200).json({ type: 'unsaved', message: 'Post removed from bookmarks', success: true });
        } else {
            // Add post to bookmarks
            await user.updateOne({ $addToSet: { bookmarks: post._id } });
            await user.save();

            return res.status(200).json({ type: 'saved', message: 'Post bookmarked', success: true });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Something went wrong', success: false });
    }
};

// import sharp from "sharp";
// import cloudinary from "../utils/cloudinary.js";
// import { populate } from "dotenv";
// import { Post } from "../models/post.model.js";
// import {User} from "../models/user.model,js"
// import { Comment } from "../models/comment.model.js";
// export const addNewPost  =async (req,res)=>{
//     try{
//     const {caption}=req.body;
//     const image =req.file;
//     const authorId=req.id;
//     if(!image) return res.status(400).json({message:'Image required'});
//     //image required
//     const optimizedImagedBuffer=await sharp(image.buffer).resize({widht:800,height:800,fit:'inside'}).toFormat('jpej',{quality:80})
//     .toBuffer();
//     const fileUri=`data:image/jpeg;basee64,${optimizedImagedBuffer.toString('base64')}`
//     const cloudResponse=await cloudinary.uploader.upload(fileUri);
//     const post =await post.create({
//         caption,
//         image:cloudResponse.secure_url,
//         author:authorId

//     })
//     const user=await user.findById(authorId);
//     if(user){
//         user.posts.push(post._id);
//         await user.save();

//     }
//     await post.populate({path:'author', select:'-password'})

//     return res.status(201).json({
//         message:'New post added',
//         post,
//         success:true,
//     })






//     }catch(error){
// console.log(error)}
// }

// export const getAllPost =async (req,res)=>{
//     try {
//         const posts =await Post.find().sort({createdAt:-1}).populate({path:'auhtor',select:' username ,profilePicture'}).poupulate({
//             path:'comments',
//             sort:{createdAt:-1},
//             poupulate:{
//                 path:'author',
//                 select:'username,profilePicture'
//             }
//         })
//         return res.status(200).json({
//             posts,
//             success:true
//         })
//     } catch (error) {
//         console.log(error)
        
//     }
// }
// export const getUserPost=async (req,res)=>{
//     try {
//         const authorId=req.id;
//         const posts=await Post.find({author:authorId}).sort({createdAt:-1}).populate({
//             path:'comments',
//             sort:{createdAt:-1},
//             populate:{
//             select:'username,profilePicture'
//             }

//         })
//         return res.status(200).json({
//             posts,
//             success:true
//         })

        
//     } catch (error) {
//         console.log(error);
        
//     }
// }
// export const likePost=async (req,res)=>{
//     try {
//         const likeKrneWalaUserKiId=req.id;
//         const postId=req.params.id;
//         const post=await post.findById(postId)
//         if(!post)return res.status(404).json({message:'post not found',success:false});
//         await post.updateOne({$addToSet:{likes:likeKrneWalaUserKiId}})
//         await post.save()
//          //implementation soket io for real time notification

//          return res.status(200).json({message:'post liked',success:true})

//     } catch (error) {
//         console.log(error)
       
        
//     }
// } 
// export const dislikePost=async (req,res)=>{
//     try {
//         const likeKrneWalaUserKiId=req.id;
//         const postId=req.params.id;
//         const post=await post.findById(postId)
//         if(!post)return res.status(404).json({message:'post not found',success:false});
//         await post.updateOne({$pull:{likes:likeKrneWalaUserKiId}})
//         await post.save()
//          //implementation soket io for real time notification

//          return res.status(200).json({message:'post disliked',success:true})

//     } catch (error) {
//         console.log(error)
       
        
//     }
// } 
// export const addComment=async (req,res)=>{
//     try {
//         const postId=req.params.id;
//         const commentKrneWalaUserKiId=req.id;
//         const {text}=req.body;
//         const post= await post.findById(postId);
//         if(!text) return res.status(400).json({message:'text is required',success:false})
//             const comment=await Comment.create({
//         text,
//     author:commentKrneWalaUserKiId,
// post:postId
// })
// .populate({
//     path:'author',
//     select:"username,profilePicture"
// })
// post.comment.psuh(comment._id); 
// await post.save()
// return res.status(201).json({
//    message:'Comment Added',
//    comment,
//    success:true
// })
//     } catch (error) {
//         console.log(error)
//     }
// }
// export const getCommentsOfPost=async(req,res)=>{
//     try {
//         const postId=req.params.id;
//         const comments=await Comment.find({post:postId}.populate('author',' username','profilePicture'))
//         if(!comments) return res.status(404).json({message:'no comment found for this post',success:false})
//             return res.status (200).json({success:true,comments})
//     } catch (error) {
//         console.log(error)
        
//     }
// }
// export const deletePost=(req,res)=>{
//     try {
//         const postId=req.params.id;
//         const authorId=req.id;
//         const post=await Post.findById(postId)
//         if(!post ) return res.status(404).json({message:'post not found',success:false});
//         if(post.author.toString()!==authorId) return res.status(403).json({message:'Unauthorised'})
//             //delete post
//         await Post.findByIdAndDelete(postId);
//         //remove the postid from the user post
//         let user=await user.findById(authorId)
//         user.posts=user.postsfilter(id=>id.toString!==postId)
//         await user.save();
//         //delete associated comments
//         await Comment.DeleteMany({post:postId})
//         return res.status(200).json({
//             success:true
// ,message:'post deleted'
//         })

        
//     } catch (error) {
//         console.log(error)
//     }

// }
// export const bookmarkPost=async(req,res)=>{
//     try {
//         const postId=req.params.id;
//         const authorId=req.id;
//         const post=await post.findById(postId)
//         if(!post) return res.status(404).json({mesage:'post not found',success:false})
//             const user=await User.findById(authorId)
//         if(user.bookmarks.includes(post._id)){
//             //alredy bookmarke removed fron bookmarked
//             await user.updateOne({$pull:{bookmarks:post._id}
//             })
//             await user.save();
//             return res.status(200).json({type:'unsaved',message:'post emoved from bookmark',success:true})
//         }else{
//             //book mark karne padega 
//             await user.updateOne({$addToSet:{bookmarks:post._id}
//             })
//             await user.save();
//             return res.status(200).json({type:'saved',message:'post bookmarked',success:true})
//         }


//     } catch (error) {
        
//     }
// }