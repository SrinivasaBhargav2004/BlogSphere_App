import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/Testing")
  .then(() => console.log("MongoDB Server Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"]
  },
  content: {
    type: String,
    required: [true, "Content is required"]
  },
  author: {
    type: String,
    required: [true, "Author is required"]
  },
  username: {
    type: String,
    required: [true, "Username is required"]
  }
}, { timestamps: true });

const Post = mongoose.model("Post", PostSchema);
export default Post;
