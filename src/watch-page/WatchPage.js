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
    const incrementViews = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/users/${currentVideo.owner}/videos/${currentVideo._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ views: views + 1 }),
          }
        );

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Failed to update views");
        }

        const updatedVideo = await res.json();
        const updatedVideos = videos.map((video) =>
          video._id === currentVideo._id ? updatedVideo : video
        );
        setVideos(updatedVideos);
      } catch (error) {
        console.error("Error updating views:", error);
      }
    };

    if (!viewIncremented) {
      setViews((prevViews) => prevViews + 1);
      incrementViews();
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

  const updateVideoData = async (data) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/users/${currentVideo.owner}/videos/${currentVideo._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to update video data");
      }

      const updatedVideo = await res.json();
      const updatedVideos = videos.map((video) =>
        video._id === currentVideo._id ? updatedVideo : video
      );
      setVideos(updatedVideos);
    } catch (error) {
      console.error("Error updating video data:", error);
    }
  };

  if (!currentVideo) {
    return <div>Video not found</div>; // Handle case where currentVideo is not found
  }

  return (
    <div className={`watch-page-container ${isDarkMode ? "dark-mode" : ""}`}>
      <div className={`content-container ${isDarkMode ? "dark-mode" : ""}`}>
        <div
          className={`watch-block-container ${isDarkMode ? "dark-mode" : ""}`}
        >
          <div className="video-player-wrapper">
            <video
              key={currentVideo.url}
              controls={true}
              className="video-player"
            >
              <source src={currentVideo.url} type="video/mp4"></source>
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="video-info">
            <VideoMetadata
              videoData={{ ...currentVideo, views: views.toLocaleString() }}
              users={users}
              isDarkMode={isDarkMode}
              updateVideoData={updateVideoData}
            />
            <CommentSection
              currentUser={currentUser}
              videoId={currentVideo._id}
              comments={currentVideo.comments || []}
              videos={videos}
              setVideos={setVideos}
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
