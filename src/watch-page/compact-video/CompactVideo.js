import React from "react";
import "../../App.css";
import "./CompactVideo.css";

const CompactVideo = ({ src, setCurrentVideo }) => {
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
            {src.owner}
          </span>
          <span className="no-space" id="info">
            {src.views} ⋅ {src.date}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CompactVideo;
