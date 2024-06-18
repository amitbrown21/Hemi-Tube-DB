import React from "react";
import CompactVideo from "./compact-video/CompactVideo";
import "./WatchPage.css";

const SideList = ({ videos = [], setCurrentVideo }) => {
  //Need to update video3 in the db, the video is not there!
  return (
    <div className="side-list-container">
      {videos.length > 0 ? (
        videos.map((video, index) => (
          <CompactVideo
            key={index}
            src={video}
            setCurrentVideo={setCurrentVideo}
          />
        ))
      ) : (
        <div>No videos available</div>
      )}
    </div>
  );
};

export default SideList;
