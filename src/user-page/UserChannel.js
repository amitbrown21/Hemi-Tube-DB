import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./UserChannel.css";

function UserChannel({ setCurrentVideo, isDarkMode }) {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [userVideos, setUserVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const userResponse = await fetch(
          `http://localhost:3000/api/users/${userId}`
        );
        const videosResponse = await fetch(
          `http://localhost:3000/api/users/${userId}/videos`
        );

        if (!userResponse.ok || !videosResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const userData = await userResponse.json();
        const videosData = await videosResponse.json();

        setUserData(userData);
        setUserVideos(videosData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={`user-channel ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="user-info">
        <img
          src={userData.profilePicture}
          alt={userData.username}
          className="large-profile-pic"
        />
        <div className="user-text-info">
          <h2>{userData.username}</h2>
          <p>{userData.subscribers} subscribers</p>
        </div>
      </div>
      <div className="videos-container">
        <div className="video-grid">
          {userVideos.map((video) => (
            <div key={video._id} className="video-card">
              <div className="video-thumbnail-container">
                <Link
                  to={`/watchpage/${video._id}`}
                  onClick={() => handleVideoClick(video)}
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="video-thumbnail"
                  />
                  <span className="video-duration">{video.duration}</span>
                </Link>
              </div>
              <div className="video-info">
                <h4 className={`video-title ${isDarkMode ? "dark-mode" : ""}`}>
                  {video.title}
                </h4>
                <p className={`video-stats ${isDarkMode ? "dark-mode" : ""}`}>
                  {video.views} views • {formatDate(video.date)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserChannel;
