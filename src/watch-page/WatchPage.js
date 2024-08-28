import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SideList from "./SideList";
import VideoMetadata from "./video-metadata/VideoMetadata";
import "./WatchPage.css";
import CommentSection from "./comments/CommentSection";

function WatchPage({
  currentUser,
  videos = [],
  setVideos,
  setCurrentVideo,
  isDarkMode,
}) {
  const { videoID } = useParams(); // Extract videoID from URL
  const [videoData, setVideoData] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideoDataAndComments = async () => {
      try {
        // First, fetch video data to get the owner ID
        const videoRes = await fetch(
          `http://localhost:3000/api/videos/${videoID}`
        );

        if (!videoRes.ok) {
          throw new Error("Failed to fetch video data");
        }

        const video = await videoRes.json();
        const videoOwnerID = video.owner;

        // Fetch video data with the owner ID
        const ownerVideoRes = await fetch(
          `http://localhost:3000/api/users/${videoOwnerID}/videos/${videoID}`
        );

        if (!ownerVideoRes.ok) {
          throw new Error("Failed to fetch video data from owner");
        }

        const updatedVideo = await ownerVideoRes.json();
        console.log("Fetched video data:", updatedVideo);

        // Fetch owner data
        const ownerRes = await fetch(
          `http://localhost:3000/api/users/${updatedVideo.owner}`
        );

        if (!ownerRes.ok) {
          throw new Error("Failed to fetch owner data");
        }

        const ownerData = await ownerRes.json();
        console.log("Fetched owner data:", ownerData);

        // Combine video and owner data
        const videoWithOwnerData = {
          ...updatedVideo,
          owner: ownerData,
        };

        setVideoData(videoWithOwnerData);

        // Fetch comments
        const commentsRes = await fetch(
          `http://localhost:3000/api/users/${updatedVideo.owner}/videos/${updatedVideo._id}/comments`
        );

        if (!commentsRes.ok) {
          const errorText = await commentsRes.text();
          console.error("Comments fetch error:", errorText);
          throw new Error(`Failed to fetch comments: ${errorText}`);
        }

        const fetchedComments = await commentsRes.json();
        console.log("Fetched comments in WatchPage:", fetchedComments);
        setComments(fetchedComments);
      } catch (error) {
        console.error("Error fetching video data and comments:", error);
        setError(error.message);
      }
    };

    fetchVideoDataAndComments();
  }, [videoID]);

  useEffect(() => {
    const incrementViews = async () => {
      try {
        // Construct the request body or query string based on your server's needs
        const response = await fetch(
          `http://localhost:3000/api/videos/${videoID}/incrementViews`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Optional, if user is logged in
            },
            body: JSON.stringify({
              userId: currentUser ? currentUser._id : "Guest", // Send the currentUser ID or 'Guest'
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to increment views");
        }

        const incrementedVideo = await response.json();
        setVideoData(incrementedVideo);
      } catch (error) {
        console.error("Error incrementing views:", error);
      }
    };

    incrementViews();
  }, [videoID, currentUser]);

  const updateVideoData = async (data) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/api/users/${videoData.owner._id}/videos/${videoData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
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
        video._id === videoData._id ? updatedVideo : video
      );
      setVideos(updatedVideos);
    } catch (error) {
      console.error("Error updating video data:", error);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!videoData) {
    return <div>Loading...</div>;
  }

  console.log("Passing videoData to VideoMetadata:", videoData);
  return (
    <div className={`watch-page-container ${isDarkMode ? "dark-mode" : ""}`}>
      <div className={`content-container ${isDarkMode ? "dark-mode" : ""}`}>
        <div
          className={`watch-block-container ${isDarkMode ? "dark-mode" : ""}`}
        >
          <div className="video-player-wrapper">
            <video key={videoData.url} controls={true} className="video-player">
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
              videoOwner={videoData.owner._id || videoData.owner}
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
