import React, { useState, useEffect } from "react";
import "../../App.css";
import "./CompactVideo.css";

const CompactVideo = ({ src, setCurrentVideo }) => {
  const [ownerUsername, setOwnerUsername] = useState("Unknown");
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    if (src.owner) {
      const fetchOwnerData = async () => {
        try {
          console.log("Fetching owner data for owner ID:", src.owner); // Log the owner ID
          const response = await fetch(
            `http://localhost:3000/api/users/${src.owner}`
          );
          if (response.ok) {
            const data = await response.json();
            setOwnerUsername(data.username);
          } else {
            console.error("Failed to fetch owner data");
          }
        } catch (error) {
          console.error("Error fetching owner data:", error);
        }
      };

      fetchOwnerData();
    } else {
      console.warn("Owner ID is not available");
    }
  }, [src.owner]);

  useEffect(() => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    };

    setFormattedDate(formatDate(src.date));
  }, [src.date]);

  const handleClick = () => {
    setCurrentVideo(src);
  };

  return (
    <div onClick={handleClick} className="compact-video-container a-no-style">
      <img
        src={src.thumbnail}
        alt="thumbnail"
        className="compact-thumbnail"
      ></img>
      <div className="video-data">
        <div>
          <span className="thumbnail-title">{src.title}</span>
        </div>
        <div>
          <span className="no-space" id="info">
            {src.owner.username}
          </span>
          <span className="no-space" id="info">
            {src.views} ⋅ {formattedDate}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CompactVideo;
