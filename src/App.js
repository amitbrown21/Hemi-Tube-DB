import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import WatchPage from "./watch-page/WatchPage";
import LogIn from "./log-in/LogIn";
import UploadVideo from "./upload-video/UploadVideo";
import SignUp from "./sign-up/SignUpPage";
import usersDB from "./db/userData.json";
import videosDB from "./db/videoData.json";
import Home from "./home-page/Home";
import Layout from "./components/Layout/Layout";
import EditVideo from "./edit-video/EditVideo";
import UserChannel from "./user-page/UserChannel";
import EditUser from "./edit-user/EditUser";

function App() {
  const [users, setUsers] = useState(usersDB);
  const [videos, setVideos] = useState(videosDB);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (token) {
      // First, verify the token
      fetch("http://localhost:3000/api/users/verify-token", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Invalid token");
          }
        })
        .then((data) => {
          // If token is valid, fetch user data
          return fetch(`http://localhost:3000/api/users/${data.userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Failed to fetch user data");
          }
        })
        .then((userData) => {
          setCurrentUser(userData);
        })
        .catch((error) => {
          console.error("Error during auto-login:", error);
          sessionStorage.removeItem("token");
        });
    }
  }, []);

  const props = {
    users,
    setUsers,
    videos,
    setVideos,
    currentUser,
    setCurrentUser,
    currentVideo,
    setCurrentVideo,
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              {...props}
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
            />
          }
        >
          <Route index element={<Home {...props} isDarkMode={isDarkMode} />} />
          <Route
            path="/watchpage/:videoID"
            element={<WatchPage {...props} isDarkMode={isDarkMode} />}
          />
          <Route path="/channel/:userId" element={<UserChannel {...props} />} />
          <Route
            path="/editvideo/:videoId"
            element={<EditVideo {...props} isDarkMode={isDarkMode} />}
          />
          <Route
            path="/edituser/:userId"
            element={
              <EditUser
                {...props}
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
        </Route>
        <Route path="/login" element={<LogIn {...props} />} />
        <Route path="/uploadvideo" element={<UploadVideo {...props} />} />
        <Route
          path="/signup"
          element={<SignUp {...props} isDarkMode={isDarkMode} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
