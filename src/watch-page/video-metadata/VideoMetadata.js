import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LikeButton from "../feedback-btn/LikeButton";
import DislikeButton from "../feedback-btn/DislikeButton";
import ShareButton from "../feedback-btn/ShareButton";
import "./VideoMetadata.css";
import UserPic from "../../components/user-pic/UserPic";

const VideoMetadata = ({ videoData, isDarkMode, updateVideoData }) => {
  const [voteStatus, setVoteStatus] = useState(0);
  const [upVotes, setUpVotes] = useState(0);
  const [downVotes, setDownVotes] = useState(0);
  const [formattedDate, setFormattedDate] = useState("");
  const [ownerData, setOwnerData] = useState(null);

  useEffect(() => {
    console.log("Video Data in VideoMetadata:", videoData);

    if (videoData) {
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

      const fetchOwnerData = async () => {
        try {
          console.log("Fetching owner data...");
          const response = await fetch(`http://localhost:3000/api/users/${videoData.owner}`);
          if (!response.ok) {
            throw new Error('Failed to fetch owner data');
          }
          const data = await response.json();
          console.log("Fetched owner data:", data);
          setOwnerData(data);
        } catch (error) {
          console.error('Error fetching owner data:', error);
        }
      };
  
      fetchOwnerData();
    } else {
      console.log("Video data is not available yet");
    }
  }, [videoData]);

  const handleLike = () => {
    const newVoteStatus = voteStatus === 1 ? 0 : 1;
    const newUpVotes = voteStatus === 1 ? upVotes - 1 : upVotes + 1;
    const newDownVotes = voteStatus === -1 ? downVotes - 1 : downVotes;
    setVoteStatus(newVoteStatus);
    setUpVotes(newUpVotes);
    setDownVotes(newDownVotes);
    updateVideoData({ likes: newUpVotes, dislikes: newDownVotes });
  };

  const handleDislike = () => {
    const newVoteStatus = voteStatus === -1 ? 0 : -1;
    const newDownVotes = voteStatus === -1 ? downVotes - 1 : downVotes + 1;
    const newUpVotes = voteStatus === 1 ? upVotes - 1 : upVotes;
    setVoteStatus(newVoteStatus);
    setUpVotes(newUpVotes);
    setDownVotes(newDownVotes);
    updateVideoData({ likes: newUpVotes, dislikes: newDownVotes });
  };

  console.log("Current state:", { videoData, ownerData });

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
          {videoData.views} views &nbsp;{formattedDate}
        </p>
        <p style={{ color: isDarkMode ? "#b3b3b3" : "inherit" }}>
          {videoData.description}
        </p>
      </div>
    </div>
  );
};

export default VideoMetadata;
