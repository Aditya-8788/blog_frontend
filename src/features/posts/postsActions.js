import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";



export const fetchPosts = createAsyncThunk(
  "posts/",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/blogs`);
      console.log( res.data, "fetched posts");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchBookmarked = createAsyncThunk(
  "posts/fetchBookmarked",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token")?.replace(/^"|"$/g, "");
      const res = await axios.get(`/api/blogs/bookmarked`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data; // array of blog docs
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchPostById = createAsyncThunk(
  "posts/fetchPostById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/blogs/${id}`);
      console.log(`first post by id`, res.data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);



export const createPost = createAsyncThunk(
  "posts/createPost",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token")?.replace(/^"|"$/g, "");
      const res = await axios.post(`/api/blogs`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token")?.replace(/^"|"$/g, "");
      const res = await axios.put(`/api/blogs/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// features/posts/postsActions.js
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token").replace(/^"|"$/g, "");;
      const res = await axios.delete(`/api/blogs/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { postId, message: res.data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


export const toggleBookmark = createAsyncThunk(
  "posts/toggleBookmark",
  async (postId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token")?.replace(/^"|"$/g, "");
      const res = await axios.post(`/api/blogs/${postId}/bookmark`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // returns { bookmarks: [...] }
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);





export const fetchMyPosts = () => async (dispatch) => {
  try {
    const token = localStorage.getItem("token")?.replace(/^"|"$/g, "");
    const res = await axios.get(`/api/blogs/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: "GET_USER_POSTS", payload: res.data });
  } catch (err) {
    console.error("Failed to fetch user posts:", err);
    // dispatch({ type: "GET_USER_POSTS_ERROR", payload: err.message });
  }
};