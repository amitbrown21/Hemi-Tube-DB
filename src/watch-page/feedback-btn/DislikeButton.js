import React from "react";
import "./Feedback.css";

const DislikeButton = ({ downVotes, setDownVotes, voteStatus, setVoteStatus, setUpVotes }) => {
  const handleDislike = () => {
    if (voteStatus === 1) {
      setUpVotes((upVotes) => parseInt(upVotes) - 1);
    }

    setVoteStatus((status) => (status === -1 ? 0 : -1));

    if (voteStatus === -1) {
      setDownVotes((downVotes) => parseInt(downVotes) - 1);
    } else {
      setDownVotes((downVotes) => parseInt(downVotes) + 1);
    }
  };

  return (
    <button id="right-feedback-button" type="button" className="feedback-button" onClick={handleDislike}>
      <img
        src={voteStatus === -1 ? "assets/icons/thumbs_down_filled.svg" : "assets/icons/thumbs_down.svg"}
        alt="thumbs down"
        className="icon-img"
      />
      {downVotes}
    </button>
  );
};

export default DislikeButton;
