import React, { useState } from "react";
import LoginForm from "./LoginForm";
import { Navigate, Link } from "react-router-dom";

function LogIn({ setCurrentUser }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (username, password) => {
    try {
      // Login request
      const loginResponse = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        throw new Error(errorData.message || "Invalid username or password");
      }

      const { token, userId } = await loginResponse.json();
      sessionStorage.setItem("token", token);
      
      // Get user details
      const userResponse = await fetch(`http://localhost:3000/api/users/${userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user details");
      }

      const userData = await userResponse.json();
      setCurrentUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      setError(error.message);
      console.error("Login error:", error);
    }
  };

  const handleLogoClick = () => {
    <Navigate to="/" />;
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container mt-5 pt-5">
      <div className="row">
        <div className="col mt-5 pt-4">
          <Link to="/" className="logo-link" onClick={handleLogoClick}>
            <img
              src="assets/img/youtube_logo.png"
              alt="YouTube Logo"
              className="p-2"
            />
          </Link>
          <h4 className="lh-1">Discover, watch, and share the world's</h4>
          <h4 className="lh-1">videos on YouTube.</h4>
        </div>
        <div className="offset-lg-0 col-lg-6">
          <LoginForm onSubmit={handleLogin} />
          {error && <h4 className="ps-3 text-danger">{error}</h4>}
        </div>
      </div>
    </div>
  );
}

export default LogIn;