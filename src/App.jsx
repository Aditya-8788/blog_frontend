import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import SinglePost from "./pages/singlePost";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import CreateBlog from "./pages/CreateBlog";
import Navbar from "./pages/NavBar";
import NotFound from "./pages/NotFound";
import MyAccount from "./pages/MyAccount";
import PrivateRoute from "./components/PrivateRoute";
// import About from "./pages/About";

function App() {
  return (
    <BrowserRouter> {/* ✅ Only one router */}
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/posts/:id" element={<SinglePost />} />
        <Route path="/register" element={<CreateAccount />} />
        <Route path="/create" element={<PrivateRoute><CreateBlog /></PrivateRoute>} />
        <Route path="/edit/:postId" element={<CreateBlog />} />
        <Route path="/create/:postId" element={<CreateBlog />} />
        <Route path="/my-account" element={<MyAccount />} />
        { /* <Route path="/about" element={<About />} /> */ }
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


