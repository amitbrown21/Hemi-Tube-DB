import React from "react";
import "./Feedback.css";

const LikeButton = ({ upVotes, setUpVotes, voteStatus, setVoteStatus, setDownVotes, isDarkMode }) => {
  const handleLike = () => {
    if (voteStatus === -1) {
      setDownVotes((downVotes) => parseInt(downVotes) - 1);
    }

    setVoteStatus((status) => (status === 1 ? 0 : 1));

    if (voteStatus === 1) {
      setUpVotes((upVotes) => parseInt(upVotes) - 1);
    } else {
      setUpVotes((upVotes) => parseInt(upVotes) + 1);
    }
  };

  return (
    <button id="left-feedback-button" type="button" className="feedback-button" onClick={handleLike}>
      <img
        src={voteStatus === 1 ? "assets/icons/thumbs_up_filled.svg" : "assets/icons/thumbs_up.svg"}
        alt="thumbs up"
        className="icon-img"
      />
      {upVotes}
    </button>
  );
};

export default LikeButton;
