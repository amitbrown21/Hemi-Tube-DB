import React from "react";
import "./Feedback.css";

const DislikeButton = ({
  downVotes,
  voteStatus,
  handleDislike,
  isDarkMode,
}) => {
  return (
    <button
      id="right-feedback-button"
      type="button"
      className="feedback-button"
      onClick={handleDislike}
    >
      <img
        src={
          voteStatus === -1
            ? "assets/icons/thumbs_down_filled.svg"
            : "assets/icons/thumbs_down.svg"
        }
        alt="thumbs down"
        className="icon-img"
      />
      {downVotes}
    </button>
  );
};

export default DislikeButton;
