import React, { useEffect, useState } from "react";
import SideList from "./SideList";
import VideoMetadata from "./video-metadata/VideoMetadata";
import "./WatchPage.css";
import CommentSection from "./comments/CommentSection";

function WatchPage({
  currentUser,
  currentVideo,
  videos = [],
  setVideos,
  setCurrentVideo,
  users,
  isDarkMode,
}) {
  const [views, setViews] = useState(
    typeof currentVideo.views === "number"
      ? currentVideo.views
      : parseInt(currentVideo.views.replace(/,/g, ""))
  );
  const [viewIncremented, setViewIncremented] = useState(false);

  useEffect(() => {
    if (!viewIncremented) {
      setViews((prevViews) => prevViews + 1);
      const updatedVideos = videos.map((video) => {
        if (video._id === currentVideo._id) {
          return { ...video, views: views + 1 };
        }
        return video;
      });
      setVideos(updatedVideos);
      setViewIncremented(true);
    }
  }, [currentVideo, viewIncremented, setVideos, views, videos]);

  useEffect(() => {
    setViews(
      typeof currentVideo.views === "number"
        ? currentVideo.views
        : parseInt(currentVideo.views.replace(/,/g, ""))
    );
    setViewIncremented(false);
  }, [currentVideo]);

  if (!currentVideo) {
    return <div>Video not found</div>; // Handle case where currentVideo is not found
  }

  console.log("in WatchPage", currentUser);

  return (
    <div className={`watch-page-container ${isDarkMode ? "dark-mode" : ""}`}>
      <div className={`content-container ${isDarkMode ? "dark-mode" : ""}`}>
        <div
          className={`watch-block-container ${isDarkMode ? "dark-mode" : ""}`}
        >
          <video
            key={currentVideo.url}
            controls={true}
            className="video-player"
          >
            <source src={currentVideo.url} type="video/mp4"></source>
            Your browser does not support the video tag.
          </video>
          <VideoMetadata
            videoData={{ ...currentVideo, views: views.toLocaleString() }}
            users={users} // Ensure users is passed
            isDarkMode={isDarkMode} // Pass dark mode to VideoMetadata
          />
          <CommentSection
            currentUser={currentUser}
            videoId={currentVideo._id}
            comments={currentVideo.comments || []}
            videos={videos}
            setVideos={setVideos}
            isDarkMode={isDarkMode} // Pass dark mode to CommentSection
          />
        </div>
        <div className={`side-list ${isDarkMode ? "dark-mode" : ""}`}>
          <SideList videos={videos} setCurrentVideo={setCurrentVideo} />
        </div>
      </div>
    </div>
  );
}

export default WatchPage;
