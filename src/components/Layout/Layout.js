import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../header/Header";
import Sidebar from "../side-bar/Sidebar";
import "./Layout.css";

function Layout({
  currentUser,
  users,
  videos,
  setCurrentUser,
  setUsers,
  setVideos,
  currentVideo,
  setCurrentVideo,
  isDarkMode,
  toggleDarkMode,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className={`app-layout ${isDarkMode ? "dark-mode" : ""}`}>
      <Header
        onSearch={handleSearch}
        currentUser={currentUser}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        setCurrentUser={setCurrentUser}
      />
      <div className="content-wrapper">
        <Sidebar currentUser={currentUser} isDarkMode={isDarkMode} />
        <main className="main-content">
          <Outlet
            context={{
              searchQuery,
              currentUser,
              users,
              videos,
              setCurrentUser,
              setUsers,
              setVideos,
              currentVideo,
              setCurrentVideo,
              isDarkMode,
            }}
          />
        </main>
      </div>
    </div>
  );
}

export default Layout;
