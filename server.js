import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import Contact from './models/Contact.js';
import User from './models/User.js';
import Post from './models/Post.js';

dotenv.config();

const app = express();
app.use(express.json());

// Allow requests from frontend only (set correctly in .env before deploy)
app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
}));

// MongoDB Atlas connection from env
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Contact route
app.post("/contact", async (req, res) => {
  const { email, phno } = req.body;
  if (!email || !phno) return res.status(400).json({ message: "Enter All Details" });
  const newContact = new Contact({ email, phno });
  await newContact.save();
  res.status(200).json({ message: "Successfully Contacted" });
});

// Registration
app.post('/register', async (req, res) => {
  const { email, password, username, isAdmin } = req.body;
  if (!email || !password || !username) return res.status(400).json({ message: "Enter All Details" });
  const existuser = await User.findOne({ email });
  if (existuser) return res.status(409).json({ message: "User Already Exists" });
  const newUser = new User({ email, password, username, isAdmin });
  await newUser.save();
  res.status(201).json({ message: "Registered Successfully" });
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const exUser = await User.findOne({ email });
  if (!exUser) return res.status(404).json({ message: "Please Register First" });
  if (exUser.password !== password) return res.status(401).json({ message: "Password Incorrect" });
  res.status(200).json({ message: "Login Successfully", username: exUser.username, isAdmin: exUser.isAdmin || false });
});

// Get user posts for profile
app.get("/profile", async (req, res) => {
  const uname = req.query.username;
  const posts = await Post.find({ username: uname });
  res.json(posts);
});

// Create post
app.post('/createpost', async (req, res) => {
  const { title, content, author, username } = req.body;
  if (!title || !content || !author || !username) return res.status(400).json({ message: "Please Enter All Fields" });
  const newPost = new Post({ title, content, author, username });
  await newPost.save();
  res.status(201).json({ message: "Post Created Successfully" });
});

// Get all posts
app.get("/posts", async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

// Update post
app.put("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content, author } = req.body;
  await Post.findByIdAndUpdate(id, { title, content, author });
  res.json({ message: "Post updated successfully" });
});

// Delete post
app.delete("/posts/:id", async (req, res) => {
  const { id } = req.params;
  await Post.findByIdAndDelete(id);
  res.json({ message: "Post deleted successfully" });
});

//API for Comments
app.post('/posts/:id/comments', async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.comments.push({ text: req.body.text, date: new Date() });
  await post.save();
  res.json(post.comments);
});

app.get('/posts/:id/comments', async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.json(post.comments);
});

//API for Likes

app.post('/posts/:id/like', async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.likes += 1;
  await post.save();
  res.json({ likes: post.likes });
});
app.get('/posts/:id/likes', async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.json({ likes: post.likes });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
