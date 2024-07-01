import React, { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
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
  isDarkMode,
}) {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [topVideos, setTopVideos] = useState([]);
  const [otherVideos, setOtherVideos] = useState([]);
  const [allVideos, setAllVideos] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialVideos = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/videos");
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Failed to fetch initial videos");
        }
        const data = await res.json();
        setTopVideos(data.topVideos);
        setOtherVideos(data.otherVideos);
        setVideos([...data.topVideos, ...data.otherVideos]);
      } catch (error) {
        console.error("Error fetching initial videos:", error);
      }
    };

    const fetchAllVideos = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/videos/all");
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Failed to fetch all videos");
        }
        const data = await res.json();
        setAllVideos(data);
      } catch (error) {
        console.error("Error fetching all videos:", error);
      }
    };

    fetchInitialVideos();
    fetchAllVideos();

    const token = sessionStorage.getItem("token");
    if (token && !currentUser) {
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
  }, [setVideos, setCurrentUser, currentUser]);

  useEffect(() => {
    const newSearchQuery = searchParams.get("search") || "";
    setSearchQuery(newSearchQuery);
    setIsSearching(!!newSearchQuery);
  }, [searchParams]);

  const handleVideoClick = (video) => {
    setCurrentVideo(video);
    navigate(`/watchpage/${video._id}`);
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
      <div className="section-title-container">
        <h2 className={`section-title ${isDarkMode ? "dark-mode" : ""}`}>
          {title}
        </h2>
        <div className="section-title-underline"></div>
      </div>
      <div className="video-grid">
        {videoList.map((video) => (
          <div key={video._id} className="video-card">
            <div className="video-thumbnail-container">
              <div onClick={() => handleVideoClick(video)}>
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="video-thumbnail"
                />
                <span className="video-duration">{video.duration}</span>
              </div>
            </div>
            <div className="video-info">
              <div className="title-edit-container">
                <h4 className={`video-title ${isDarkMode ? "dark-mode" : ""}`}>
                  {video.title}
                </h4>
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

  const filteredVideos = allVideos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`homepage-root ${isDarkMode ? "dark-mode" : ""}`}>
      {isSearching ? (
        renderVideoGrid(filteredVideos, `Search Results for "${searchQuery}"`)
      ) : (
        <>
          {renderVideoGrid(topVideos, "Top 10 Most Viewed Videos")}
          {renderVideoGrid(otherVideos, "Other Videos")}
        </>
      )}
    </div>
  );
}

export default HomePage;
