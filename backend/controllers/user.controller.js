//import {User} from "../models/user.model.js"
import { User } from '../models/user.model.js'; 
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post} from '../models/post.model.js';


export const register= async (req,res)=>{
    try{
        const{
            username,email,password
        }=req.body;
        if(!username ||!email ||!password){
            return res.status(401).json({
                message:"something is missing ,please chhek!",
                success:false,
            })
        }
        const user =await User.findOne({email});
        if(user){
            return res.status(401).json({
                message:"try different email",
                success:false,
            })
        }
const hashedPassword=await bcrypt.hash(password,10);
        await User.create({
            username,
            email,
            password:hashedPassword
        })
        return res.status(201).json({
            message:"account created successfully",
            success:true,
        })

    }
    catch (error){
        console.log(error);

    }
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false,
            });
        };

        const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

        // populate each post if in the posts array
        const populatedPosts = await Promise.all(
            user.posts.map( async (postId) => {
                const post = await Post.findById(postId);
                if(post.author.equals(user._id)){
                    return post;
                }
                return null;
            })
        )
        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture:user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts
        }
        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
    }
};
// export const login =async (req,res)=>{
//     try{
//         const{email,password}=req.body;
//         if(!email ||!password){
//             return res.status(401).json({
//                 message:"something is missing ,please chhek!",
//                 success:false,
//             })
//         }
//         let user =await User .findOne({email});
//         if(!user){
//             return res.status(401).json({
//                 message:" incorrect email or password",
//                 success:false,
//             })
//         }
//         const isPasswordMatch=await bcrypt.compare(password,user.password);
//         if(!isPasswordMatch){
//             return res.status(401).json({
//                 message:" incorrect email or password",
//                 success:false,
//             })


//         }
        
        
//         const token =await jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:'1d'});
//         //populate each port if in the ports array
//         const populatedPosts=await Promise.all(
//             user.posts.map(async(postId)=>{
//                 const post= await Post.findById(postId)
//                 if(post.author.equals(user._id)){
//                     return post;

//                 }
//                 return null;
//             })
//         )
//         user={
//             _id:user._id,
//             username:user.username,
//             email:user.email,
//             profilePicture:user.profilePicture,
//             bio:user.bio,
//             followers:user.followers,
//             following:user.following,
//             posts:populatedPosts
//         }


//         return res.cookie('token',token,{httpOnly:true,sameSite:'strict',maxAge:1*24*60*60*1000}).json({
//             message:`Welcome back ${user.username}`,
//             success:true,
//         })



//     }
//     catch(error){
//         console.log(error)
//     }
// }
export const logout =async(_,res)=>{
    try {
        return res.cookie("token","",{maxAge:0}).json({
            message:'logout successfully',
            success:true
        })
        
    } catch (error) {
        console.log(error)
        
    }
}
// export const getProfile=async(req,res)=>{
//     try {
//         const userId=req.params.id;
//         let user=await User.findById(userId).select('-password');
//         return res.status(200).json({
//             user,
//             success:true
//         })
        
//     } catch (error) {
//         console.log(error)
        
//     }
// }
export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).populate({path:'posts', createdAt:-1}).populate('bookmarks');
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};




// export const editProfile=async(req,res)=>{
//     try {
//         const userId=req.id;
//         const{bio,gender}=req.body;
//         const profilePicture=req.file;
//         let cloudResponse;
//         if(profilePicture){
//             const fileUri=getDataUri(profilePicture);
//             cloudResponse=await cloudinary.uploader.upload(fileUri);
//         }
//         const user=await User.findById(userId).select('-password');
//         if(!user){
//             return res.status(404).json({
//                 message:"User not found ",
//                 success:false
//             })
//         }
//         if(bio) user.bio=bio;
//         if(gender) user.gender=gender;
//         if(profilePicture) user.profilePicture=cloudResponse.secure_url;
//         await user.save();
//         return res.status(200).json({
//             message:'profile updated',
//             success:true,
//             user
//         })




        
//     } catch (error) {
//         console.log(error)
//     }
// };
export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        };
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: 'Profile updated.',
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
    }
};
export const getSuggestedUsers=async(req,res)=>{
    try {
        const suggestedUsers=await User.find({_id:{$ne:req.id}}).select("-password")
       
        if(!suggestedUsers){
            return res.status(400).json({
                message:'currnetly do not have nay users'
            })
        }
        return res.status(200).json({
            successs:true,
            users:suggestedUsers
        })
        
    } catch (error) {
console.log(error);
        
    }
}
// export const followOrUnfollow=async (req,res)=>{
//     try{
//         const followKarneWala=req.id;
//         const jiskoFollowkarunga=req.params.id;
//         if(followKarneWala === jiskoFollowkarunga){
//             return res.status(400).json({
//                 message:"you can not follow /unfollow youself",
//                 success:false
//             })
//         }
//         const user=await User.findById(followKarneWala);
//         const targetUser=await User.findById(jiskoFollowkarunga);
//         if(!user ||!targetUser){
//             return res.status(400).json({
//                 message:"user not found",
//                 success:false
//             })

//         }
//         //mai check karung afollow karna hai ya unfollow
//         const isFollowing=user.following.includes(jiskoFollowkarunga);
//         if(isFollowing){
//             //unfollow logic aayega
//             await Promise.all([
//                 user.updateOne({_id:followKarneWala
//                 },{$pull:{following:jiskoFollowkarunga}}),
          
//             user.updateOne({
//                 _id:jiskoFollowkarunga
//             },{$pull:{followers:followKarneWala}}),
//         ])
 
//            return res.status(200).json({message:'Unfollowed successfully',success:true}); 

//         }
//         else{
//             //follow logic aayega
//             await Promise.all([
//                 user.updateOne({
//                     _id:followKarneWala
//                 },{$push:{following:jiskoFollowkarunga}}),
          
//             user.updateOne({
//                 _id:jiskoFollowkarunga
//             },{$push:{followers:followKarneWala}}),
//         ])
//         return res.status(200).json({message:'followed successfully',success:true}); 

//         }
//     }
//     catch (error){
//         console.log(error);
//     }
// }
export const followOrUnfollow = async (req, res) => {
    try {
        const followInitiatorId = req.id; // The user initiating the follow/unfollow action
        const targetUserId = req.params.id; // The user to be followed/unfollowed

        // Prevent self-following
        if (followInitiatorId === targetUserId) {
            return res.status(400).json({
                message: "You cannot follow/unfollow yourself.",
                success: false
            });
        }

        // Find both users in the database
        const [initiator, targetUser] = await Promise.all([
            User.findById(followInitiatorId),
            User.findById(targetUserId)
        ]);

        // Ensure both users exist
        if (!initiator || !targetUser) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        // Check if the initiator is already following the target user
        const isFollowing = initiator.following.includes(targetUserId);

        if (isFollowing) {
            // Unfollow logic
            await Promise.all([
                initiator.updateOne({ $pull: { following: targetUserId } }),
                targetUser.updateOne({ $pull: { followers: followInitiatorId } })
            ]);

            return res.status(200).json({
                message: "Unfollowed successfully.",
                success: true
            });
        } else {
            // Follow logic
            await Promise.all([
                initiator.updateOne({ $push: { following: targetUserId } }),
                targetUser.updateOne({ $push: { followers: followInitiatorId } })
            ]);

            return res.status(200).json({
                message: "Followed successfully.",
                success: true
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "An error occurred while processing the request.",
            success: false,
            error: error.message
        });
    }
};
