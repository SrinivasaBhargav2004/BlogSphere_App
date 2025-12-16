import axios from "axios";
import { useState, useEffect } from "react";
import '../styles/CreatePost.css';

function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, []);

  async function handleCreate() {
    if (!title || !content || !author || !username) {
      setMessage("Please fill in all fields.");
      return;
    }
    try {
      const res = await axios.post(process.env.REACT_APP_API_URL + "/createpost", { title, content, author, username });
      setMessage(res.data.message);
    } catch (err) {
      setMessage("Creating Post Failed.");
    }
  }

  return (
    <div className="create-container">
      <h2 id="create">Create New Post</h2>
      <div className="create-input">
        <input type="text" placeholder="Enter Title" value={title}
          onChange={e => setTitle(e.target.value)} required />
        <textarea placeholder="Write Content Here" value={content}
          onChange={e => setContent(e.target.value)} required />
        <input type="text" placeholder="Author Name" value={author}
          onChange={e => setAuthor(e.target.value)} required />
        <button className="submit-btn-create" onClick={handleCreate}>
          Create Post
        </button>
      </div>
      {message && <h2 className="response-message">{message}</h2>}
    </div>
  );
}
export default CreatePost;
