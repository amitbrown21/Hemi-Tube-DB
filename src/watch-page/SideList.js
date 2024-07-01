import React from "react";
import CompactVideo from "./compact-video/CompactVideo";
import "./WatchPage.css";

const SideList = ({ videos = [], setCurrentVideo }) => {
  return (
    <div className="side-list-container">
      {videos.length > 0 ? (
        videos.map((video, index) => {
          //console.log("Video data:", video); // Log the video data
          return (
            <CompactVideo
              key={index}
              src={video}
              setCurrentVideo={setCurrentVideo}
            />
          );
        })
      ) : (
        <div>No videos available</div>
      )}
    </div>
  );
};

export default SideList;
