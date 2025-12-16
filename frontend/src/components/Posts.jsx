import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Posts.css';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [search, setSearch] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [comments, setComments] = useState({});
  const [likes, setLikes] = useState({});
  const [showComments, setShowComments] = useState({});

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + '/posts')
      .then(res => {
        setPosts(res.data);
        const likesObj = {}, commentsObj = {}, showObj = {};
        res.data.forEach(post => {
          likesObj[post._id || post.id] = post.likes || 0;
          commentsObj[post._id || post.id] = post.comments ? post.comments.map(com => com.text) : [];
          showObj[post._id || post.id] = false;
        });
        setLikes(likesObj);
        setComments(commentsObj);
        setShowComments(showObj);
        setLoading(false);
      })
      .catch(e => {
        setErr('Failed to load posts. Please try again.');
        setLoading(false);
      });
  }, []);

  function formatContent(content) {
    return content
      ? content.split(/\r?\n\r?\n/).map((para, idx) =>
          <p className="post-para" key={idx}>{para.trim()}</p>
        )
      : null;
  }

  const authors = [...new Set(posts.map(post => post.author || "Unknown"))];
  const tags = [...new Set((posts.flatMap(p => p.tags || [])))];

  const filteredPosts = posts.filter(post =>
    (search === "" ||
      post.title?.toLowerCase().includes(search.toLowerCase()) ||
      post.content?.toLowerCase().includes(search.toLowerCase()) ||
      post.author?.toLowerCase().includes(search.toLowerCase())) &&
    (authorFilter === "" || (post.author && post.author === authorFilter)) &&
    (dateFilter === "" || (
      post.createdAt &&
      new Date(post.createdAt).toISOString().slice(0, 10) === dateFilter
    )) &&
    (tagFilter === "" || (post.tags && post.tags.includes(tagFilter)))
  );

  function handleLike(id) {
    setLikes(prev => ({
      ...prev,
      [id]: prev[id] + 1
    }));
    // For real app, POST to backend here!
  }

  function handleAddComment(id, comment) {
    if (!comment.trim()) return;
    setComments(prev => ({
      ...prev,
      [id]: [...prev[id], comment.trim()]
    }));
    // For real app, POST to backend here!
  }
  function handleToggleComments(id) {
    setShowComments(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  }

  return (
    <div className="posts-page-container">
      <h2>All Posts</h2>
      <input
        type="text"
        className="search-input"
        placeholder="Search posts..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <select
        value={authorFilter}
        onChange={e => setAuthorFilter(e.target.value)}
        className="filter-select"
      >
        <option value="">All Authors</option>
        {authors.map(a => <option key={a} value={a}>{a}</option>)}
      </select>
      <input
        type="date"
        value={dateFilter}
        onChange={e => setDateFilter(e.target.value)}
        className="filter-date"
      />
      <select
        value={tagFilter}
        onChange={e => setTagFilter(e.target.value)}
        className="filter-select"
      >
        <option value="">All Categories</option>
        {tags.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      {loading && <p>Loading...</p>}
      {err && <p className="error">{err}</p>}
      {!loading && filteredPosts.length === 0 && <p>No posts found.</p>}
      <div className="posts-grid">
        {filteredPosts.map(post => (
          <div key={post._id || post.id} className="post-card">
            <h3>{post.title}</h3>
            <div className="post-content">{formatContent(post.content || post.body)}</div>
            <div className="meta">
              By {post.author || "Unknown"}
              <span className="date-stamp">
                {" | "}{post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
              </span>
            </div>
            <div className="tags-list">
              {post.tags && post.tags.map((tag, i) => (
                <span className="tag" key={i}>{tag}</span>
              ))}
            </div>
            <div className="reactions">
              <button className="like-btn" onClick={() => handleLike(post._id || post.id)}>
                ❤️ {likes[post._id || post.id] || 0}
              </button>
            </div>
            <div className="toggle-comments">
              <button onClick={() => handleToggleComments(post._id || post.id)} className="show-comments-btn">
                {showComments[post._id || post.id] ? "Hide Comments" : "Show Comments"}
              </button>
            </div>
            {showComments[post._id || post.id] && (
              <div className="comments-section">
                <h4>Comments</h4>
                <div className="comments-list">
                  {(comments[post._id || post.id] || []).map((comment, idx) => (
                    <div className="comment" key={idx}>{comment}</div>
                  ))}
                </div>
                <CommentInput onAdd={comment => handleAddComment(post._id || post.id, comment)} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CommentInput({ onAdd }) {
  const [value, setValue] = useState("");
  return (
    <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
      <input
        type="text"
        className="comment-input"
        placeholder="Add a comment..."
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <button className="comment-btn" onClick={() => {
        onAdd(value);
        setValue("");
      }}>
        Post
      </button>
    </div>
  );
}

export default Posts;
