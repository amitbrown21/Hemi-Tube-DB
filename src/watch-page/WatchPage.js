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
        console.log(`Fetching video data for videoID: ${videoID}`);
        const videoRes = await fetch(
          `http://localhost:3000/api/videos/${videoID}`
        );

        if (!videoRes.ok) {
          const errorText = await videoRes.text();
          console.error("Failed to fetch video data:", errorText);
          throw new Error("Failed to fetch video data");
        }

        const video = await videoRes.json();
        const videoOwnerID = video.owner;
        console.log(`Fetched video data:`, video);

        console.log(`Fetching video data from owner with ID: ${videoOwnerID}`);
        const ownerVideoRes = await fetch(
          `http://localhost:3000/api/users/${videoOwnerID}/videos/${videoID}`
        );

        if (!ownerVideoRes.ok) {
          const errorText = await ownerVideoRes.text();
          console.error("Failed to fetch video data from owner:", errorText);
          throw new Error("Failed to fetch video data from owner");
        }

        const updatedVideo = await ownerVideoRes.json();
        console.log("Fetched updated video data:", updatedVideo);

        console.log(`Fetching owner data for ownerID: ${videoOwnerID}`);
        const ownerRes = await fetch(
          `http://localhost:3000/api/users/${videoOwnerID}`
        );

        if (!ownerRes.ok) {
          const errorText = await ownerRes.text();
          console.error("Failed to fetch owner data:", errorText);
          throw new Error("Failed to fetch owner data");
        }

        const ownerData = await ownerRes.json();
        console.log("Fetched owner data:", ownerData);

        const videoWithOwnerData = {
          ...updatedVideo,
          owner: ownerData,
        };

        setVideoData(videoWithOwnerData);
        console.log("Set video data with owner info:", videoWithOwnerData);

        console.log(`Fetching comments for videoID: ${videoID}`);
        const commentsRes = await fetch(
          `http://localhost:3000/api/users/${videoOwnerID}/videos/${videoID}/comments`
        );

        if (!commentsRes.ok) {
          const errorText = await commentsRes.text();
          console.error("Failed to fetch comments:", errorText);
          throw new Error(`Failed to fetch comments: ${errorText}`);
        }

        const fetchedComments = await commentsRes.json();
        console.log("Fetched comments:", fetchedComments);
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
        console.log(`Incrementing views for videoID: ${videoID}`);
        const response = await fetch(
          `http://localhost:3000/api/videos/${videoID}/incrementViews`,
          {
            method: "POST",
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Failed to increment views:", errorText);
          throw new Error("Failed to increment views");
        }

        const incrementedVideo = await response.json();
        console.log("Incremented views, updated video data:", incrementedVideo);
        setVideoData(incrementedVideo);
      } catch (error) {
        console.error("Error incrementing views:", error);
      }
    };

    incrementViews();
  }, [videoID]);

  const updateVideoData = async (data) => {
    try {
      const token = sessionStorage.getItem("token");
      console.log("Updating video data with:", data);
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
        const errorText = await res.text();
        console.error("Failed to update video data:", errorText);
        throw new Error("Failed to update video data");
      }

      const updatedVideo = await res.json();
      console.log("Updated video data:", updatedVideo);
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
              <source src={`http://localhost:3000/${videoData.url}`} type="video/mp4"></source>
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
