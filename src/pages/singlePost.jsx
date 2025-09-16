

// export default SinglePost;
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchPostById, toggleBookmark } from '../features/posts/postsActions';
import {
  Card,
  Typography,
  Chip,
  Avatar,
  CircularProgress,
  Divider,
  Box,
  IconButton,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Pinterest,
  LinkedIn,
  Google,
} from '@mui/icons-material';
import '../styles/singlePost.scss';

const SinglePost = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const post = useSelector((state) => state.posts.selectedPost);
  const loading = useSelector((state) => state.posts.loading);
  const error = useSelector((state) => state.posts.error);

  useEffect(() => {
    dispatch(fetchPostById(id));
  }, [dispatch, id]);

  if (loading) return <CircularProgress />;
  if (error) return <p>Error: {error}</p>;
  if (!post) return <p>Post not found.</p>;

  return (
    <div className="single-post-page">
            <IconButton onClick={() => navigate(-1)} className="back-button" style={{ marginBottom: '1rem' }}>
        ← Back
      </IconButton>
      <Typography variant="h3" className="post-title">{post.title}</Typography>

      <div className="post-meta">
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        <span>•</span>
        <span>{post.views || 0} Views</span>
        <span>•</span>
        <span>{post.comments?.length || 0} Comments</span>
      </div>

      <button
        onClick={() => dispatch(toggleBookmark(post._id))}
        className="bookmark-btn"
        aria-pressed={!!post.bookmarked}
        title={post.bookmarked ? "Remove bookmark" : "Add bookmark"}
        style={{
          background: '#fff',
          border: '1px solid #ddd',
          borderRadius: 8,
          padding: '6px 10px',
          cursor: 'pointer',
          margin: '8px 0',
          alignSelf: 'flex-start'
        }}
      >
        {post.bookmarked ? '★ Remove Bookmark' : '☆ Add Bookmark'}
      </button>

      {post.image && <img src={post.image} alt="post" className="post-image" />}

      <div className="post-content">
        {post.content.split('\n').map((para, i) => (
          <Typography key={i} variant="body1" paragraph>{para}</Typography>
        ))}
      </div>

      <Divider className="divider" />

      <div className="post-tags">
        {post.tags?.map((tag, i) => (
          <Chip key={i} label={`#${tag}`} className="tag-chip" />
        ))}
      </div>

      <Divider className="divider" />

      <div className="share-buttons">
        <IconButton><Facebook /></IconButton>
        <IconButton><Google /></IconButton>
        <IconButton><Twitter /></IconButton>
        <IconButton><LinkedIn /></IconButton>
        <IconButton><Pinterest /></IconButton>
      </div>

      <div className="author-box">
        <Avatar className="author-avatar">{post.author?.name?.[0]}</Avatar>
        <Box>
          <Typography variant="subtitle1">{post.author?.name}</Typography>
          <Typography variant="body2">
            {post.author?.bio || "Author bio not available."}
          </Typography>
        </Box>
      </div>

      {/* <div className="post-navigation">
        <Typography className="nav-link">← PREVIOUS</Typography>
        <Typography className="nav-link">NEXT →</Typography>
      </div> */}
    </div>
  );
};

export default SinglePost;
