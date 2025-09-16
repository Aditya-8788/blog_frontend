import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/auth/login`, credentials);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
      console.log(res.data, "login response data");
      
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, { rejectWithValue }) => {
        console.log("[register] Payload before mapping:", userData);
      try {
        const payload = {
          ...userData,
          // Send both username and name for backend compatibility
          name: userData.name || userData.username || "",
        };
        const res = await axiosInstance.post(
          `/auth/signup`,
          payload,
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
    
        return res.data;
      } catch (err) {
        console.error("[register] Error details:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          url: `/api/auth/signup`,
        });
        return rejectWithValue(
          err.response?.data?.message ||
          err.response?.data?.error ||
          `Register failed (${err.response?.status || 'network'}): ${err.message}`
        );
      }
    }
  );
  
  export const updateProfile = createAsyncThunk(
    "auth/updateProfile",
    async ({ name, profilePic }, { rejectWithValue, getState }) => {
      try {
        const token = getState().auth.token;

        const response = await axiosInstance.put(
          `/auth/profile`,
          { name, profilePic },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // keep localStorage in sync
        const updatedUser = response.data.user;
        try { localStorage.setItem("user", JSON.stringify(updatedUser)); } catch (_) {}

        return updatedUser;
      } catch (err) {
        console.error("Profile update failed:", err);
        return rejectWithValue(
          err.response?.data?.message || err.message || "Update failed"
        );
      }
    }
  );