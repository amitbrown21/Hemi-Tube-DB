import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../App.css";
import "./CompactVideo.css";

const CompactVideo = ({ src, setCurrentVideo }) => {
  const [ownerUsername, setOwnerUsername] = useState("Unknown");
  const [formattedDate, setFormattedDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
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
    navigate(`/watchpage/${src._id}`);
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
