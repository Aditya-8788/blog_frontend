import { createSlice } from "@reduxjs/toolkit";
import {
  fetchPosts,
  fetchPostById,
  createPost,
  updatePost,
  deletePost,
  toggleBookmark,
  fetchBookmarked,
} from "./postsActions";

const initialState = {
  posts: [],
  selectedPost: null,
  loading: false,
  error: null,
  userPosts: [], // For storing posts of the logged-in user
  bookmarkedPosts: [],
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(p => p._id !== action.payload.postId);
      })

      .addCase(createPost.fulfilled, (state, action) => {
        // Put newest at the top immediately for UX
        state.posts = [action.payload, ...state.posts];
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.posts = state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        );
      })
      .addCase("GET_USER_POSTS", (state, action) => {
        state.userPosts = action.payload;
      })
      .addCase(toggleBookmark.fulfilled, (state, action) => {
        // action.payload = { bookmarks: [...] }
        const bookmarkSet = new Set((action.payload.bookmarks || []).map(id => id.toString()));
        state.posts = state.posts.map(p => ({
          ...p,
          bookmarked: bookmarkSet.has(p._id?.toString()),
        }));
        state.userPosts = (state.userPosts || []).map(p => ({
          ...p,
          bookmarked: bookmarkSet.has(p._id?.toString()),
        }));
        if (state.selectedPost?._id) {
          state.selectedPost = {
            ...state.selectedPost,
            bookmarked: bookmarkSet.has(state.selectedPost._id?.toString()),
          };
        }
      })
      .addCase(fetchBookmarked.fulfilled, (state, action) => {
        // could store separately or mark in posts; for simplicity store in posts if present
        // also expose as userPosts-like list if needed later
        state.bookmarkedPosts = action.payload;
      })
      
    
  },
});

export default postsSlice.reducer;
