
import React, { useEffect, useState } from "react";
import "../styles/CreateBlog.scss";
import { useDispatch, useSelector } from "react-redux";
import { createPost, updatePost, fetchPostById, fetchMyPosts, fetchPosts } from "../features/posts/postsActions";
import { useParams, useNavigate } from "react-router-dom";

const CreateBlog = () => {
  const { postId } = useParams(); // Get postId from URL (edit mode if present)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedPost = useSelector((state) => state.posts.selectedPost);
  // const [form, setForm] = useState({
  //   title: "",
  //   content: "",
  // });
  const [form, setForm] = useState({
    title: "",
    content: "",
    tags: "",
    image: null, // File
  });
  
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const fileToBase64 = (file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    let imageBase64 = null;
    if (form.image) {
      try {
        imageBase64 = await fileToBase64(form.image);
      } catch (_) {
        imageBase64 = null;
      }
    }

    const payload = {
      title: form.title,
      content: form.content,
      tags: (form.tags || "").split(",").map(t => t.trim()).filter(Boolean),
      image: imageBase64,
    };

    if (postId) {
      await dispatch(updatePost({ id: postId, formData: payload }));
      await dispatch(fetchMyPosts());
      await dispatch(fetchPosts());
      navigate("/");
    } else {
      await dispatch(createPost(payload));
      await dispatch(fetchPosts());
      navigate("/");
    }
  };
  

  // Fetch the post if in edit mode
  useEffect(() => {
    if (postId) {
      dispatch(fetchPostById(postId));
    }
  }, [dispatch, postId]);

  // Update form when post data is loaded
  useEffect(() => {
    if (selectedPost && postId) {
      setForm({
        title: selectedPost.title || "",
        content: selectedPost.content || "",
      });
    }
  }, [selectedPost, postId]);


  

  return (
    <div className="create-blog">
      <h1>{postId ? "✏️ Update" : "📢 Publish"} Your <span>Blog</span></h1>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          type="text"
          name="title"
          placeholder="Enter blog title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <label>Tags (comma separated)</label>
<input
  type="text"
  name="tags"
  value={form.tags}
  onChange={handleChange}
  placeholder="e.g. react,javascript,web"
/>

<label>Upload Image (optional)</label>
<input
  type="file"
  name="image"
  accept="image/*"
  onChange={handleChange}
/>

        <label>Content</label>
        <textarea
          name="content"
          placeholder="Write your content here..."
          rows="10"
          value={form.content}
          onChange={handleChange}
          required
        ></textarea>

        <button type="submit">{postId ? "Update" : "Publish"}</button>
      </form>
    </div>
  );
};

export default CreateBlog;
