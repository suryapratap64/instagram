import express from"express"
import dotenv from 'dotenv';
dotenv.config();
import cors from "cors"
import cookieParser from "cookie-parser"
import { urlencoded } from "express"

import connectDB from "./utils/db.js";

import userRoute from "./routes/user.route.js"
import postRoute from "./routes/post.route.js"

import messageRoute from "./routes/message.route.js"
import path from "path"
import { app,server } from "./socket/socket.js";



// const app=express()
const PORT=process.env.PORT || 3000;
const __dirname=path.resolve();
// console.log(__dirname);

app.get("/",(req,res)=>{
    return res.status(200).json({
        message:"i,m coming from backend",
        success:true
    })
})
//middlewares
app.use(express.json())
app.use(cookieParser())

app.use(urlencoded({extended:true}))
const corsOptions={
    origin:'http://localhost:5173',
    credentials:true
}
app.use(cors(corsOptions))
// yah par apani apani api aayengi
app.use("/api/v1/user",userRoute);
app.use("/api/v1/post",postRoute);
app.use("/api/v1/message",messageRoute);

//"http://localhost:8000/api/v1/user/register"
app.use(express.static(path.join(__dirname,"/frontend/dist")));
app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"))
})


server.listen(PORT,()=>{
    connectDB();

    console.log(`server listen at  port ${PORT}`)
})
