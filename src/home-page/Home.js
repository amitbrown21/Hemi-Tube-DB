import React, { useEffect } from "react";
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
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, [setVideos]);

  console.log("in HomePage", currentUser);

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <div className={`homepage-root ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="video-grid">
        {filteredVideos.map((video) => (
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
                <h4 className={`video-title ${isDarkMode ? "dark-mode" : ""}`}>
                  {video.title}
                </h4>
                {currentUser && (
                  <Link to="/editvideo" onClick={() => handleVideoClick(video)}>
                    <i className="bi bi-pencil-square edit-icon"></i>
                  </Link>
                )}
              </div>
              <p className={`video-owner ${isDarkMode ? "dark-mode" : ""}`}>
                {video.owner.username}{" "}
                {/* Ensure this matches your video schema */}
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
}

export default HomePage;
