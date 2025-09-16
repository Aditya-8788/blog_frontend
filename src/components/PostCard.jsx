import React from "react";
import "../styles/postcard.scss";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleBookmark } from "../features/posts/postsActions";

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const formattedDate = new Date(post.createdAt).toLocaleDateString();

  const onToggleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleBookmark(post._id));
  };

  const onReadMore = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (token && user) {
      navigate(`/posts/${post._id}`);
      return;
    }
    const goLogin = window.confirm("You need to login or sign up to view this post. Click OK to login, Cancel to sign up.");
    if (goLogin) {
      navigate('/login');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="post-card">
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="post-image-thumb"
          style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 8 }}
        />
      )}
      <div className="post-header">
        <h3 className="post-title">{post.title}</h3>
        <div className="post-meta">
          <span className="post-author">{post.author?.username || "Unknown"}</span>
          <span className="post-email">{post.author?.email || "Unknown"}</span>
          <span className="post-date">📅 {formattedDate}</span>
        </div>
      </div>

      <p className="post-excerpt">
        {post.content ? post.content.substring(0, 150) + "..." : "No content available"}
      </p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={onReadMore} className="read-more" style={{ background: 'transparent', border: 'none', color: '#1976d2', cursor: 'pointer', padding: 0 }}>
          Read More →
        </button>
        <button
          onClick={onToggleBookmark}
          className="bookmark-btn"
          aria-pressed={!!post.bookmarked}
          title={post.bookmarked ? "Remove bookmark" : "Add bookmark"}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: post.bookmarked ? "#e91e63" : "#555",
            fontWeight: 600,
          }}
        >
          {post.bookmarked ? "★ Bookmarked" : "☆ Bookmark"}
        </button>
      </div>
    </div>
  );
};

export default PostCard;
