import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LikeButton from "../feedback-btn/LikeButton";
import DislikeButton from "../feedback-btn/DislikeButton";
import ShareButton from "../feedback-btn/ShareButton";
import "./VideoMetadata.css";
import UserPic from "../../components/user-pic/UserPic";

const VideoMetadata = ({ videoData, isDarkMode, updateVideoData }) => {
  const [voteStatus, setVoteStatus] = useState(0); // 0: neutral, 1: liked, -1: disliked
  const [upVotes, setUpVotes] = useState(videoData.likes);
  const [downVotes, setDownVotes] = useState(videoData.dislikes);
  const [views, setViews] = useState(videoData.views);
  const [formattedDate, setFormattedDate] = useState("");
  const [ownerData, setOwnerData] = useState(null);

  useEffect(() => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    };

    setFormattedDate(formatDate(videoData.date));
    setUpVotes(videoData.likes);
    setDownVotes(videoData.dislikes);
    setViews(videoData.views);

    const fetchOwnerData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/users/${videoData.owner}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch owner data");
        }
        const data = await response.json();
        setOwnerData(data);
      } catch (error) {
        console.error("Error fetching owner data:", error);
      }
    };

    fetchOwnerData();
  }, [videoData]);

  const handleLike = async () => {
    let newLikeStatus = 0;
    if (voteStatus === 1) {
      newLikeStatus = 0; // Removing like
    } else {
      newLikeStatus = 1; // Adding like
    }
    await updateLikeDislikeStatus(newLikeStatus, voteStatus);
  };

  const handleDislike = async () => {
    let newDislikeStatus = 0;
    if (voteStatus === -1) {
      newDislikeStatus = 0; // Removing dislike
    } else {
      newDislikeStatus = -1; // Adding dislike
    }
    await updateLikeDislikeStatus(newDislikeStatus, voteStatus);
  };

  const updateLikeDislikeStatus = async (newStatus, prevStatus) => {
    let likeChange = 0;
    let dislikeChange = 0;

    if (newStatus === 1) {
      likeChange = 1;
      if (prevStatus === -1) dislikeChange = -1;
    } else if (newStatus === -1) {
      dislikeChange = 1;
      if (prevStatus === 1) likeChange = -1;
    } else if (newStatus === 0) {
      if (prevStatus === 1) likeChange = -1;
      else if (prevStatus === -1) dislikeChange = -1;
    }

    try {
      // Update the frontend state first
      setUpVotes((prev) => prev + likeChange);
      setDownVotes((prev) => prev + dislikeChange);
      setVoteStatus(newStatus);

      // Call the backend APIs to update likes/dislikes
      if (likeChange !== 0) {
        await fetch(
          `http://localhost:3000/api/videos/${videoData._id}/${
            likeChange > 0 ? "incrementLikes" : "decrementLikes"
          }`,
          { method: "POST" }
        );
      }

      if (dislikeChange !== 0) {
        await fetch(
          `http://localhost:3000/api/videos/${videoData._id}/${
            dislikeChange > 0 ? "incrementDislikes" : "decrementDislikes"
          }`,
          { method: "POST" }
        );
      }

      // Fetch the updated video data and update the parent state
      const response = await fetch(
        `http://localhost:3000/api/users/${videoData.owner}/videos/${videoData._id}`
      );
      if (response.ok) {
        const updatedVideo = await response.json();
        updateVideoData(updatedVideo);
      }
    } catch (error) {
      console.error("Error updating likes/dislikes:", error);
    }
  };

  if (!videoData || !ownerData) {
    return <div>Loading video metadata...</div>;
  }

  return (
    <div className={isDarkMode ? "dark-mode" : ""}>
      <h1 className={`main-video-title ${isDarkMode ? "dark-mode" : ""}`}>
        {videoData.title}
      </h1>
      <div className={`video-metadata ${isDarkMode ? "dark-mode" : ""}`}>
        <div className="owner-container">
          <div>
            <Link to={`/channel/${ownerData._id}`}>
              <UserPic
                src={ownerData.profilePicture || "assets/icons/notLoggedIn.svg"}
                size={32}
              />
            </Link>
          </div>
          <div className="owner-data">
            <Link to={`/channel/${ownerData._id}`} id="owner-name">
              {ownerData.username}
            </Link>
            <span id="info">{ownerData.subscribers} subscribers</span>
          </div>
        </div>
        <div className="feedback-container">
          <div className="vote-container">
            <LikeButton
              upVotes={upVotes}
              voteStatus={voteStatus}
              handleLike={handleLike}
              isDarkMode={isDarkMode}
            />
            <DislikeButton
              downVotes={downVotes}
              voteStatus={voteStatus}
              handleDislike={handleDislike}
              isDarkMode={isDarkMode}
            />
          </div>
          <div>
            <ShareButton />
          </div>
        </div>
      </div>
      <hr />
      <div className={`description ${isDarkMode ? "dark-mode" : ""}`}>
        <p
          style={{
            fontWeight: "bold",
            color: isDarkMode ? "#ffffff" : "inherit",
          }}
        >
          {views} views &nbsp;{formattedDate}
        </p>
        <p style={{ color: isDarkMode ? "#b3b3b3" : "inherit" }}>
          {videoData.description}
        </p>
      </div>
    </div>
  );
};

export default VideoMetadata;
