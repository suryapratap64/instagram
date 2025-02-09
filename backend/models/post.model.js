import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
  caption: { type: String, default: "" },
  image: { type: String, required: true },
  // media: { type: String, required: true }, // Supports both images & videos
  // type: { type: String, enum: ["post", "reel"], default: "post" }, // Post or Reel
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});
export const Post = mongoose.model("Post", postSchema);
