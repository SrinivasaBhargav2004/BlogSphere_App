import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
    setCheckingAuth(false);
  }, []);

  useEffect(() => {
    if (!username) return;
    async function fetchPosts() {
      try {
        const res = await axios.get(process.env.REACT_APP_API_URL + `/profile?username=${username}`);
        setPosts(res.data);
      } catch (err) {
        setError("Error fetching posts");
      }
    }
    fetchPosts();
  }, [username]);

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(process.env.REACT_APP_API_URL + `/posts/${id}`);
      setPosts(posts.filter(post => post._id !== id));
    } catch {
      setError("Error deleting post");
    }
  }

  async function handleEdit(post) {
    const updatedTitle = prompt("New Title", post.title);
    const updatedContent = prompt("New Content", post.content);
    const updatedAuthor = prompt("New Author", post.author);
    if (!updatedTitle || !updatedContent || !updatedAuthor) return;
    try {
      await axios.put(process.env.REACT_APP_API_URL + `/posts/${post._id}`, {
        title: updatedTitle, content: updatedContent, author: updatedAuthor
      });
      const res = await axios.get(process.env.REACT_APP_API_URL + `/profile?username=${username}`);
      setPosts(res.data);
    } catch {
      setError("Error editing post");
    }
  }

  function formatProfileContent(content) {
    return content
      ? content.split(/\r?\n\r?\n/).map((para, idx) =>
          <p className="post-para" key={idx}>{para.trim()}</p>
        )
      : null;
  }

  if (checkingAuth) return null;
  if (!username) {
    return (
      <div className="page-container">
        <div className="profile-container">
          <div className="profile-card">
            <h1 style={{ color: "#d9534f" }}>Please Login First</h1>
            <button onClick={() => navigate("/login")} className="logout-btn" style={{ marginTop: 18 }}>
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="profile-container">
        <div className="profile-card">
          <img src="profile.png" alt="Profile" />
          <h2 id="profile-text">{username}</h2>
          <h1>Welcome {username}!</h1>
          <button onClick={handleLogout} className="logout-btn">Log Out</button>
        </div>
      </div>
      <div className="personal-post">
        <h2 id="home-head">Your Posts</h2>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div className="post-card" key={post._id}>
              <div className="post-head">{post.title}</div>
              <div className="post-content">
                {formatProfileContent(post.content)}
              </div>
              <div className="meta">-- {post.author}</div>
              <div className="button-group">
                <button onClick={() => handleEdit(post)}>Edit</button>
                <button onClick={() => handleDelete(post._id)}>Delete</button>
              </div>
            </div>
          ))
        ) : (
          <h1>No Posts Available</h1>
        )}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default Profile;
