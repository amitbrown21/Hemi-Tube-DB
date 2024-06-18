import React, { useState } from "react";
import "./comments.css";
import UserPic from "../../components/user-pic/UserPic";
import "../feedback-btn/Feedback.css";

const SubmitComment = ({ currentUser, addComment }) => {
  const [focus, setFocus] = useState(false);
  const [commentBody, setCommentBody] = useState("");
  console.log("In SubmitComment", currentUser);

  const defaultProfilePicture = "assets/icons/notLoggedIn.svg";
  const profilePicture = currentUser?.profilePicture || defaultProfilePicture;

  const onComment = () => {
    if (commentBody.trim() !== "") {
      const newComment = {
        id: Date.now(), // or another unique id generator
        body: commentBody,
        username: currentUser?.username || "Unknown",
        profilePicture: profilePicture,
      };
      addComment(newComment);
      setCommentBody("");
    }
  };

  const onCancel = () => {
    setCommentBody("");
  };

  if (!currentUser) {
    return (
      <div className="login-prompt">
        <p>You need to be logged in to comment.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="user-comment-container">
        <UserPic src={profilePicture} size={40} />
        <form className="submit-comment-container">
          <input
            placeholder="Add a comment"
            value={commentBody}
            onChange={(event) => setCommentBody(event.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
          ></input>
          <hr style={{ margin: "0px" }} />
        </form>
      </div>
      <div
        className={`comment-submit-buttons ${
          focus || commentBody !== "" ? "visible" : "hidden"
        }`}
      >
        <button type="button" onClick={onComment} className="feedback-button">
          Comment
        </button>
        <button type="button" onClick={onCancel} className="feedback-button">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SubmitComment;
