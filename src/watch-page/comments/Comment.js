import React, { useState } from "react";
import "./comments.css";
import UserPic from "../../components/user-pic/UserPic";
import "../feedback-btn/Feedback.css";

const Comment = ({
  comment,
  deleteComment,
  editComment,
  isDarkMode,
  currentUser,
}) => {
  const defaultProfilePicture = "assets/icons/notLoggedIn.svg";
  const profilePicture = comment?.profilePicture || defaultProfilePicture;
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.body);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    editComment(comment._id, editedComment);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedComment(comment.body);
    setIsEditing(false);
  };

  return (
    <div className={`comment-container ${isDarkMode ? "dark-mode" : ""}`}>
      <UserPic src={profilePicture} size={35} />
      <div>
        <span className={`commenter-name ${isDarkMode ? "dark-mode" : ""}`}>
          {comment.username}
        </span>
        {isEditing ? (
          <textarea
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
            style={{
              width: "100%",
              color: isDarkMode ? "#ffffff" : "inherit",
              backgroundColor: isDarkMode ? "#121212" : "#ffffff",
            }}
          />
        ) : (
          <p
            style={{
              lineHeight: "1.3em",
              marginBottom: "0px",
              color: isDarkMode ? "#ffffff" : "inherit",
            }}
          >
            {comment.body}
          </p>
        )}
        <div className={`comment-buttons ${isDarkMode ? "dark-mode" : ""}`}>
          {isEditing ? (
            <>
              <button onClick={handleSave}>Save</button>
              <button onClick={handleCancel}>Cancel</button>
            </>
          ) : (
            currentUser &&
            currentUser.username === comment.username && (
              <>
                <button onClick={handleEdit}>Edit</button>
                <button onClick={() => deleteComment(comment._id)}>
                  Delete
                </button>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
