import React from "react";
import "./Feedback.css";

const LikeButton = ({ upVotes, voteStatus, handleLike, isDarkMode }) => {
  return (
    <button
      id="left-feedback-button"
      type="button"
      className="feedback-button"
      onClick={handleLike}
    >
      <img
        src={
          voteStatus === 1
            ? "/assets/icons/thumbs_up_filled.svg"
            : "/assets/icons/thumbs_up.svg"
        }
        alt="thumbs up"
        className="icon-img"
      />
      {upVotes}
    </button>
  );
};

export default LikeButton;
