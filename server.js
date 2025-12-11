import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Contact from './models/Contact.js';
import User from './models/User.js';
import Post from './models/Post.js';

mongoose.connect("mongodb://127.0.0.1:27017/Testing")
  .then(() => console.log("MongoDB Server Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

const app = express();
app.use(express.json());
app.use(cors());

// Contact Route
app.post("/contact", async (req, res) => {
  try {
    const { email, phno } = req.body;
    if (!email || !phno) {
      return res.status(400).json({ message: "Enter All Details" });
    }
    const newContact = new Contact({ email, phno });
    await newContact.save();
    return res.status(200).json({ message: "Successfully Contacted" });
  } catch (err) {
    return res.status(500).json({ message: "Contact Failed" });
  }
});

// Register Route
app.post('/register', async (req, res) => {
  try {
    const { email, password, username, isAdmin } = req.body;
    if (!email || !password || !username) {
      return res.status(400).json({ message: "Enter All Details" });
    }
    const existuser = await User.findOne({ email });
    if (existuser) {
      return res.status(409).json({ message: "User Already Exists" });
    }
    const newUser = new User({ email, password, username, isAdmin });
    await newUser.save();
    return res.status(201).json({ message: "Registered Successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error Occurred" });
  }
});

// Personal posts
app.get("/profile", async (req, res) => {
  const uname = req.query.username;
  if (!uname) {
    return res.status(400).json({ message: "Username is required" });
  }
  try {
    const posts = await Post.find({ username: uname });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
});

// DELETE POST by ID
app.delete("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error while deleting post" });
  }
});

// UPDATE POST by ID
app.put("/posts/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content, author } = req.body;
  try {
    await Post.findByIdAndUpdate(id, { title, content, author });
    res.json({ message: "Post updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error });
  }
});

// Get All Posts
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
});

// Create Post
app.post('/createpost', async (req, res) => {
  try {
    const { title, content, author, username } = req.body;
    if (!title || !content || !author || !username) {
      return res.status(400).json({ message: "Please Enter All Fields" });
    }
    const newPost = new Post({ title, content, author, username });
    await newPost.save();
    return res.status(201).json({ message: "Post Created Successfully" });
  } catch (err) {
    // Pass Mongoose validation errors to client
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message, errors: err.errors });
    }
    return res.status(500).json({ message: "An Error Occurred" });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const exUser = await User.findOne({ email });
    if (!exUser) {
      return res.status(404).json({ message: "Please Register First" });
    }
    if (exUser.password === password) {
      return res.status(200).json({ message: "Login Successfully", username: exUser.username, isAdmin: exUser.isAdmin || false });
    } else {
      return res.status(401).json({ message: "Password Incorrect" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error Occurred" });
  }
});

// Admin Register
app.post('/admin/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.status(400).json({ message: "Enter All Details" });
    }
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(409).json({ message: "User Already Exists" });
    }
    const newUser = new User({ email, password, username, isAdmin: true });
    await newUser.save();
    return res.status(201).json({ message: "Admin Registered Successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Error Occurred" });
  }
});

// Admin Login
app.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminUser = await User.findOne({ email, isAdmin: true });
    if (!adminUser) {
      return res.status(404).json({ message: "Admin not found or not an admin" });
    }
    if (adminUser.password === password) {
      return res.status(200).json({ message: "Admin Login Successful", username: adminUser.username, isAdmin: true });
    } else {
      return res.status(401).json({ message: "Incorrect Password" });
    }
  } catch (err) {
    return res.status(500).json({ message: "An error occurred during admin login" });
  }
});

// Admin: Get All Users
app.get('/admin/users', async (req, res) => {
  const { email } = req.headers;
  const adminUser = await User.findOne({ email, isAdmin: true });
  if (!adminUser) {
    return res.status(403).json({ message: "Unauthorized" });
  }
  const users = await User.find();
  res.json(users);
});

// Admin: Get all posts
app.get("/admin/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// Admin: Delete a user
app.delete("/admin/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

// Admin: Delete a post
app.delete("/admin/post/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post" });
  }
});

app.listen(5000, () => {
  console.log("Server Running On Port 5000");
});
