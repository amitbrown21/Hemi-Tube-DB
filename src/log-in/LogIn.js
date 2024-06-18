import React, { useState } from "react";
import LoginForm from "./LoginForm";
import { Navigate, Link } from "react-router-dom";

function LogIn({ setCurrentUser, users }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [wrongUsername, setWrongUsername] = useState(false);

  const validateUser = (username, password) => {
    const user = users.find((tempUser) => tempUser.username === username && tempUser.password === password);

    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    } else {
      setWrongUsername(true);
    }
  };

  const handleLogoClick = () => {
    <Navigate to="/" />;
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  <Link to="/" className="logo-link" onClick={handleLogoClick}>
    <img src="assets/img/youtube_logo.png" alt="YouTube Logo" className="p-2" />
  </Link>;
  return (
    <div className="container mt-5 pt-5">
      <div className="row">
        <div className="col mt-5 pt-4">
          <Link to="/" className="logo-link" onClick={handleLogoClick}>
            <img src="assets/img/youtube_logo.png" alt="YouTube Logo" className="p-2" />
          </Link>
          <h4 className="lh-1">Discover, watch, and share the world's</h4>
          <h4 className="lh-1">videos on YouTube.</h4>
        </div>
        <div className="offset-lg-0 col-lg-6">
          <LoginForm onSubmit={validateUser} />
          {wrongUsername && <h4 className="ps-3 text-danger">Wrong username or password!</h4>}
        </div>
      </div>
    </div>
  );
}

export default LogIn;
