import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import "../styles/Login.scss";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/auth/authActions";
import { useNavigate } from "react-router-dom";

const CreateAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Note: we navigate only after a successful submit (see handleSubmit).

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // ✅ Correct

  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("[register] submit clicked", formData);
    try {
      const result = await dispatch(registerUser(formData)).unwrap();
      console.log("[register] success", result);
      navigate("/");
    } catch (err) {
      console.error("[register] failed", err);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Create Account</h2>
        <p className="login-subtitle">Join BLOGWEB to start posting</p>

        {error && <p className="login-error">{error}</p>}

        <input
          className="login-input"
          placeholder="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <input
          className="login-input"
          placeholder="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          className="login-input"
          placeholder="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button className="login-button" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default CreateAccount;
