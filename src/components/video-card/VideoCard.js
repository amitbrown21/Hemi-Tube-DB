import React from 'react';
import './VideoCard.css';

const VideoCard = ({ video }) => {
  return (
    <div className="video-card">
      <video className="video-thumbnail" src={video.url} controls></video>
      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        <p className="video-owner">{video.owner}</p>
        <p className="video-stats">{video.views} views • {video.date}</p>
      </div>
    </div>
  );
};

export default VideoCard;
