import React, { useState } from "react";
import "./comments.css";
import UserPic from "../../components/user-pic/UserPic";
import "../feedback-btn/Feedback.css";

const SubmitComment = ({ currentUser, addComment }) => {
  const [focus, setFocus] = useState(false);
  const [commentBody, setCommentBody] = useState("");

  const defaultProfilePicture = "assets/icons/notLoggedIn.svg";
  const profilePicture = currentUser?.profilePicture || defaultProfilePicture;

  const onComment = async (e) => {
    e.preventDefault();
    if (commentBody.trim() !== "") {
      const newComment = {
        body: commentBody,
        username: currentUser?.username || "Unknown",
        profilePicture: profilePicture,
      };
      await addComment(newComment);
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
        <form className="submit-comment-container" onSubmit={onComment}>
          <input
            placeholder="Add a comment"
            value={commentBody}
            onChange={(event) => setCommentBody(event.target.value)}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
          ></input>
          <hr style={{ margin: "0px" }} />
          <div
            className={`comment-submit-buttons ${
              focus || commentBody !== "" ? "visible" : "hidden"
            }`}
          >
            <button type="submit" className="feedback-button">
              Comment
            </button>
            <button type="button" onClick={onCancel} className="feedback-button">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitComment;