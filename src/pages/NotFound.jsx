import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/NotFound.scss";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <h1 className="oops-text">Oops!</h1>
      <h2>404 - PAGE NOT FOUND</h2>
      <p>
        The page you are looking for might have been removed <br />
        had its name changed or is temporarily unavailable.
      </p>
      <button onClick={() => navigate("/")} className="home-button">
        GO TO HOMEPAGE
      </button>
    </div>
  );
};

export default NotFound;
