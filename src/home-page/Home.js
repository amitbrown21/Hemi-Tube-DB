import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./Home.css";

function HomePage({
  users,
  setUsers,
  videos,
  setVideos,
  currentUser,
  setCurrentUser,
  currentVideo,
  setCurrentVideo,
  searchQuery = "",
  setSearchQuery,
  isDarkMode,
}) {
  const [searchParams] = useSearchParams();
  searchQuery = searchParams.get("search") || "";
  const [topVideos, setTopVideos] = useState([]);
  const [otherVideos, setOtherVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/videos");
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Failed to fetch videos");
        }
        const data = await res.json();
        setVideos(data);

        // Sort videos by views in descending order
        const sortedVideos = [...data].sort((a, b) => b.views - a.views);

        // Set top 10 videos
        setTopVideos(sortedVideos.slice(0, 10));

        // Shuffle remaining videos
        const remainingVideos = sortedVideos.slice(10);
        for (let i = remainingVideos.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [remainingVideos[i], remainingVideos[j]] = [
            remainingVideos[j],
            remainingVideos[i],
          ];
        }
        setOtherVideos(remainingVideos);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
    // Add token check
    const token = sessionStorage.getItem("token");
    console.log("Token from sessionStorage:", token); // Debug log

    if (token && !currentUser) {
      console.log("Attempting to verify token"); // Debug log
      fetch("http://localhost:3000/api/users/verify-token", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          console.log("Token verification response:", response.status); // Debug log
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Invalid token");
          }
        })
        .then((data) => {
          console.log("Verified user ID:", data.userId); // Debug log
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
          console.log("Fetched user data:", userData); // Debug log
          setCurrentUser(userData);
        })
        .catch((error) => {
          console.error("Error during auto-login:", error);
          sessionStorage.removeItem("token");
        });
    }
  }, [setVideos, setCurrentUser, currentUser]);

  console.log("in HomePage", currentUser);

  const handleVideoClick = (video) => {
    setCurrentVideo(video);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const renderVideoGrid = (videoList, title) => (
    <div className="video-section">
      <h2 className={`section-title ${isDarkMode ? "dark-mode" : ""}`}>
        {title}
      </h2>
      <div className="video-grid">
        {videoList
          .filter((video) =>
            video.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((video) => (
            <div key={video._id} className="video-card">
              <div className="video-thumbnail-container">
                <Link to="/watchpage" onClick={() => handleVideoClick(video)}>
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="video-thumbnail"
                  />
                  <span className="video-duration">{video.duration}</span>
                </Link>
              </div>
              <div className="video-info">
                <div className="title-edit-container">
                  <h4
                    className={`video-title ${isDarkMode ? "dark-mode" : ""}`}
                  >
                    {video.title}
                  </h4>
                  {currentUser && currentUser._id == video.owner && (
                    <Link
                      to="/editvideo"
                      onClick={() => handleVideoClick(video)}
                    >
                      <i className="bi bi-pencil-square edit-icon"></i>
                    </Link>
                  )}
                </div>
                <p className={`video-owner ${isDarkMode ? "dark-mode" : ""}`}>
                  {video.owner.username}
                </p>
                <p className={`video-stats ${isDarkMode ? "dark-mode" : ""}`}>
                  {video.views} views • {formatDate(video.date)}
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div className={`homepage-root ${isDarkMode ? "dark-mode" : ""}`}>
      {renderVideoGrid(topVideos, "Top 10 Most Viewed Videos")}
      {renderVideoGrid(otherVideos, "All Other Videos")}
    </div>
  );
}

export default HomePage;
