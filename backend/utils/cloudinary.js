
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({});

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
export default cloudinary;


// import { v2 as cloudinary } from "cloudinary";
// import dotenv from "dotenv";

// // Load environment variables from .env file
// dotenv.config();

// // Configure Cloudinary with the loaded environment variables
// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.API_KEY,
//     api_secret: process.env.API_SECRET,
// });

// export default cloudinary;

// import {v2  as cloudinary} from "cloudinary"
// //v1 ka naam change karke cloudinary ka diya
// import dotenv from "dotenv"
// dotenv.config({
//     cloud_name:process.env.CLOUD_NAME,
//     api_key:process.env.API_KEY,
//     api_secret:process.env.API_SECRET
// })
// export default  cloudinary;