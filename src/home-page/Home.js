import React from "react";
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

  console.log("in HomePage", currentUser);

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVideoClick = (video) => {
    setCurrentVideo(video);
  };

  return (
    <div className={`homepage-root ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="video-grid">
        {filteredVideos.map((video) => (
          <div key={video.id} className="video-card">
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
                {video.owner}
              </p>
              <p className={`video-stats ${isDarkMode ? "dark-mode" : ""}`}>
                {video.views} views • {video.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
