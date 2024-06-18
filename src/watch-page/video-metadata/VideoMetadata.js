import React, { useState, useEffect } from "react";
import LikeButton from "../feedback-btn/LikeButton";
import DislikeButton from "../feedback-btn/DislikeButton";
import ShareButton from "../feedback-btn/ShareButton";
import "./VideoMetadata.css";
import UserPic from "../../components/user-pic/UserPic";

const VideoMetadata = ({ videoData, users, isDarkMode }) => {
  const [voteStatus, setVoteStatus] = useState(0); // Initial state is no vote
  const [upVotes, setUpVotes] = useState(videoData.likes); // Track upvote count
  const [downVotes, setDownVotes] = useState(videoData.dislikes); // Track downvote count

  // Find the owner data from the list of users
  const ownerData = users.find((user) => user.username === videoData.owner) || {
    username: "Unknown",
    subscribers: "0",
    profilePicture: "assets/icons/notLoggedIn.svg",
  };

  return (
    <div className={isDarkMode ? "dark-mode" : ""}>
      <h1 className={`main-video-title ${isDarkMode ? "dark-mode" : ""}`}>
        {videoData.title}
      </h1>
      <div className={`video-metadata ${isDarkMode ? "dark-mode" : ""}`}>
        <div className="owner-container">
          <div>
            <UserPic
              src={ownerData.profilePicture || "assets/icons/notLoggedIn.svg"}
              size={32}
            />
          </div>
          <div className="owner-data">
            <span id="owner-name">{ownerData.username}</span>
            <span id="info">{ownerData.subscribers}</span>
          </div>
        </div>
        <div className="feedback-container">
          <div className="vote-container">
            <LikeButton
              upVotes={upVotes}
              setUpVotes={setUpVotes}
              voteStatus={voteStatus}
              setVoteStatus={setVoteStatus}
              setDownVotes={setDownVotes}
              isDarkMode={isDarkMode}
            />
            <DislikeButton
              downVotes={downVotes}
              setDownVotes={setDownVotes}
              voteStatus={voteStatus}
              setVoteStatus={setVoteStatus}
              setUpVotes={setUpVotes}
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
          {videoData.views} views &nbsp;{videoData.date}
        </p>
        <p style={{ color: isDarkMode ? "#b3b3b3" : "inherit" }}>
          {videoData.description}
        </p>
      </div>
    </div>
  );
};

export default VideoMetadata;
