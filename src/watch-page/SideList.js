import React, { useEffect, useState } from "react";
import CompactVideo from "./compact-video/CompactVideo";
import "./WatchPage.css";

const SideList = ({ videos = [], setCurrentVideo }) => {
  const [displayVideos, setDisplayVideos] = useState([]);

  useEffect(() => {
    const fetchAdditionalVideos = async () => {
      if (videos.length < 10) {
        try {
          const response = await fetch(
            `http://localhost:3000/api/videos?limit=${10 - videos.length}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch additional videos");
          }

          const additionalVideos = await response.json();

          // Ensure additionalVideos is an array before using it
          if (Array.isArray(additionalVideos)) {
            // Introduce a delay before updating the state
            setTimeout(() => {
              setDisplayVideos([...videos, ...additionalVideos]);
            }, 1000); // 1000ms = 1 second delay
          } else {
            console.error(
              "Additional videos is not an array:",
              additionalVideos
            );
            setDisplayVideos(videos);
          }
        } catch (error) {
          console.error("Error fetching additional videos:", error);
          setDisplayVideos(videos);
        }
      } else {
        // Introduce a delay before setting the displayVideos state
        setTimeout(() => {
          setDisplayVideos(videos.slice(0, 10));
        }, 1000); // 1000ms = 1 second delay
      }
    };

    fetchAdditionalVideos();
  }, [videos]);

  return (
    <div className="side-list-container">
      {displayVideos.length > 0 ? (
        displayVideos.map((video, index) => (
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
