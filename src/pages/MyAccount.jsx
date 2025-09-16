import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Avatar,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import "../styles/MyAccount.scss";
import { updateProfile } from "../features/auth/authActions";
import { fetchMyPosts, deletePost, fetchBookmarked } from "../features/posts/postsActions";
import { useNavigate } from "react-router-dom";

const MyAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { loading: postsLoading, error: postsError, userPosts, bookmarkedPosts = [] } = useSelector((state) => state.posts);
  const [activeTab, setActiveTab] = useState("posts"); // 'posts' | 'bookmarks'
  const [name, setName] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setProfilePic(user.profilePic || "");
    }
  }, [user]);

  useEffect(() => {
    dispatch(fetchMyPosts());
    dispatch(fetchBookmarked());
  }, [dispatch]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    await dispatch(updateProfile({ name, profilePic }));
    setLoading(false);
    setSuccessMsg(" Profile updated successfully!");
    setIsEditing(false);
  };

  const handleDelete = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      dispatch(deletePost(postId)).then(() => {
        dispatch(fetchMyPosts());
      });
    }
  };

  if (!user) return <Box className="myaccount-loading"><CircularProgress /></Box>;

  return (
    <div>
      <Card className="my-account-card">
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ width: 60, height: 60, bgcolor: "#00bcd4" }} src={user.profilePic || undefined}>
                {(!user.profilePic && user.name) ? user.name[0]?.toUpperCase() : ""}
              </Avatar>
              <Box>
                <Typography variant="h5">{user?.name}</Typography>
                <Typography variant="body2" color="textSecondary">{user?.email}</Typography>
              </Box>
            </Box>
            <Button variant="outlined" onClick={() => setIsEditing(true)}>Edit Profile</Button>
          </Box>

          {isEditing && (
            <form onSubmit={handleUpdate}>
              <TextField
                label="Name"
                fullWidth
                margin="normal"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                label="Profile Image (paste URL or leave blank)"
                fullWidth
                margin="normal"
                variant="outlined"
                value={profilePic}
                onChange={(e) => setProfilePic(e.target.value)}
              />
             <Box display="flex" gap={2}>
               <Button
                 type="submit"
                 variant="contained"
                 color="secondary"
                 disabled={loading}
                 sx={{
                   mt: 2,
                   borderRadius: 2,
                   backgroundColor: '#0ad346',
                   color: 'white',
                   '&:hover': { backgroundColor: '#0ab13d' },
                 }}
               >
                 {loading ? "Updating..." : "Update"}
               </Button>
               <Button sx={{ mt: 2 }} variant="text" onClick={() => setIsEditing(false)}>Cancel</Button>
             </Box>
            </form>
          )}

          {successMsg && (
            <Typography className="success-msg">
              {successMsg}
            </Typography>
          )}
        </CardContent>
      </Card>

      <div className="home-container">
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button
            variant={activeTab === 'posts' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('posts')}
          >
            My Posts
          </Button>
          <Button
            variant={activeTab === 'bookmarks' ? 'contained' : 'outlined'}
            onClick={() => setActiveTab('bookmarks')}
          >
            Bookmarks
          </Button>
        </Box>

        {activeTab === 'posts' && (
          <>
            <h2>My Blog Posts</h2>
            {postsLoading && <p>Loading...</p>}
            {postsError && <p className="error">Error: {postsError}</p>}
            {!postsLoading && userPosts && userPosts.length === 0 ? (
              <p>No posts yet.</p>
            ) : (
              <div className="posts-wrapper">
                {[...(userPosts || [])]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((post) => (
                  <div key={post._id} className="post-card">
                    <div className="post-header">
                      <h3>{post.title}</h3>
                      <p>
                        <small>
                          Created: {new Date(post.createdAt).toLocaleDateString()}
                        </small>
                      </p>
                    </div>
                    <p>{post.content.slice(0, 100)}...</p>
                    <button onClick={() => handleDelete(post._id)} className="delete-btn">
                      Delete
                    </button>
                    <button onClick={() => navigate(`/edit/${post._id}`)} className="update-btn">
                      Update
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'bookmarks' && (
          <>
            <h2>Bookmarked Posts</h2>
            {(!bookmarkedPosts || bookmarkedPosts.length === 0) ? (
              <p>No bookmarks yet.</p>
            ) : (
              <div className="posts-wrapper">
                {[...(bookmarkedPosts || [])]
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .map((post) => (
                  <div key={post._id} className="post-card">
                    <div className="post-header">
                      <h3>{post.title}</h3>
                      <p>
                        <small>
                          Created: {new Date(post.createdAt).toLocaleDateString()}
                        </small>
                      </p>
                    </div>
                    <p>{post.content.slice(0, 100)}...</p>
                    <button onClick={() => navigate(`/posts/${post._id}`)} className="update-btn">
                      View
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyAccount;
