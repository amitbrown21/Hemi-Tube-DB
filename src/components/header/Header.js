import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

import UserMenu from "../user-menu/UserMenu";

function Header({ currentUser, setCurrentUser, isDarkMode, toggleDarkMode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/"); // Navigate to homepage after logout
  };

  const handleSearch = () => {
    navigate(`/?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleLogoClick = () => {
    setSearchQuery("");
    navigate("/");
  };

  return (
    <div className={`header ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="left-section">
        <Link to="/" className="logo-link" onClick={handleLogoClick}>
          <img
            src={
              isDarkMode
                ? "/assets/img/youtube_logo_dark.png"
                : "/assets/img/youtube_logo.png"
            }
            alt="YouTube Logo"
            className="logo"
          />
        </Link>
      </div>
      <div className="center-section">
        <div className="search-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch}>
            <img
              src="/assets/icons/search-icon.svg"
              alt="Search"
              className="search-icon"
            />
          </button>
        </div>
      </div>
      <div className="right-section">
        {currentUser ? (
          <>
            <Link to="/uploadvideo" className="icon-button-link">
              <button className="icon-button">
                <img
                  src={"/assets/icons/upload-video-icon.svg"}
                  alt="Upload Video"
                  className="upload-icon"
                />
              </button>
            </Link>
            <button className="icon-button" onClick={toggleDarkMode}>
              <img
                src="/assets/icons/darkmode-icon.svg"
                alt="Switch between dark and light mode"
                className="mode-icon"
              />
            </button>
            <div className="user-menu-container">
              <UserMenu
                currentUser={currentUser}
                onLogout={handleLogout}
                isDarkMode={isDarkMode}
              />
            </div>
          </>
        ) : (
          <>
            <button className="icon-button" onClick={toggleDarkMode}>
              <img
                src="assets/icons/darkmode-icon.svg"
                alt="Switch between dark and light mode"
                className="mode-icon"
              />
            </button>
            <Link to="/login" className="btn btn-outline-primary">
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
