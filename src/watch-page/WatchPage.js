import React, { useEffect, useState } from "react";
import SideList from "./SideList";
import VideoMetadata from "./video-metadata/VideoMetadata";
import "./WatchPage.css";
import CommentSection from "./comments/CommentSection";

function WatchPage({
  currentUser,
  currentVideo,
  videos = [],
  setVideos,
  setCurrentVideo,
  isDarkMode,
}) {
  const [videoData, setVideoData] = useState(currentVideo);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchVideoDataAndComments = async () => {
      try {
        const token = localStorage.getItem('token');
        const videoRes = await fetch(
          `http://localhost:3000/api/users/${currentVideo.owner}/videos/${currentVideo._id}`,
          {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );

        if (!videoRes.ok) {
          throw new Error("Failed to fetch video data");
        }

        const updatedVideo = await videoRes.json();
        setVideoData(updatedVideo);

        const commentsRes = await fetch(
          `http://localhost:3000/api/users/${currentVideo.owner}/videos/${currentVideo._id}/comments`,
          {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          }
        );

        if (!commentsRes.ok) {
          throw new Error("Failed to fetch comments");
        }

        const fetchedComments = await commentsRes.json();
        console.log("Fetched comments:", fetchedComments); // Add this line
        setComments(fetchedComments);

        const updatedVideos = videos.map((video) =>
          video._id === currentVideo._id ? { ...updatedVideo, comments: fetchedComments } : video
        );
        setVideos(updatedVideos);
      } catch (error) {
        console.error("Error fetching video data and comments:", error);
      }
    };

    fetchVideoDataAndComments();
  }, [currentVideo, setVideos, videos]);

  const updateVideoData = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:3000/api/users/${currentVideo.owner}/videos/${currentVideo._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update video data");
      }

      const updatedVideo = await res.json();
      setVideoData(updatedVideo);
      const updatedVideos = videos.map((video) =>
        video._id === currentVideo._id ? updatedVideo : video
      );
      setVideos(updatedVideos);
    } catch (error) {
      console.error("Error updating video data:", error);
    }
  };

  if (!videoData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`watch-page-container ${isDarkMode ? "dark-mode" : ""}`}>
      <div className={`content-container ${isDarkMode ? "dark-mode" : ""}`}>
        <div
          className={`watch-block-container ${isDarkMode ? "dark-mode" : ""}`}
        >
          <div className="video-player-wrapper">
            <video
              key={videoData.url}
              controls={true}
              className="video-player"
            >
              <source src={videoData.url} type="video/mp4"></source>
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="video-info">
            <VideoMetadata
              videoData={videoData}
              isDarkMode={isDarkMode}
              updateVideoData={updateVideoData}
            />
            <CommentSection
              currentUser={currentUser}
              videoId={videoData._id}
              videoOwner={videoData.owner}
              comments={comments}
              setComments={setComments}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
        <div className={`side-list ${isDarkMode ? "dark-mode" : ""}`}>
          <SideList videos={videos} setCurrentVideo={setCurrentVideo} />
        </div>
      </div>
    </div>
  );
}

export default WatchPage;