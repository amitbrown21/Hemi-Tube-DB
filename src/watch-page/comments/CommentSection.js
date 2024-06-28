import React, { useState, useEffect } from "react";
import "./comments.css";
import SubmitComment from "./SubmitComment";
import Comment from "./Comment";

const CommentSection = ({
  currentUser,
  videoId,
  videoOwner,
  comments,
  setComments,
  isDarkMode,
}) => {
  const [commentList, setCommentList] = useState(comments);

  useEffect(() => {
    setCommentList(comments);
  }, [comments]);

  const handleAddComment = async (newComment) => {
    try {
      const token = localStorage.getItem('token');
      
      console.log("Submitting new comment:", newComment);
  
      const res = await fetch(
        `http://localhost:3000/api/users/${videoOwner}/videos/${videoId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(newComment),
        }
      );
  
      console.log("Response status:", res.status);
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response text:", errorText);
        throw new Error(errorText || "Failed to add comment");
      }
  
      const result = await res.json();
      console.log("Result:", result);
  
      setCommentList(prevComments => [result, ...prevComments]);
      setComments(prevComments => [result, ...prevComments]);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  
  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:3000/api/users/${videoOwner}/videos/${videoId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to delete comment");
      }

      const updatedComments = commentList.filter(
        (comment) => comment._id !== commentId
      );
      setCommentList(updatedComments);
      setComments(updatedComments);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleEditComment = async (commentId, newBody) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:3000/api/users/${videoOwner}/videos/${videoId}/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ body: newBody }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to edit comment");
      }

      const result = await res.json();
      const updatedComments = commentList.map((comment) =>
        comment._id === commentId ? result : comment
      );
      setCommentList(updatedComments);
      setComments(updatedComments);
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  return (
    <div className="comment-section">
      <div className="comment-header">
        <h3>Comments</h3>
        <SubmitComment
          currentUser={currentUser}
          addComment={handleAddComment}
        />
      </div>
      {commentList.map((comment) => (
        <Comment
          key={comment._id}
          comment={comment}
          deleteComment={handleDeleteComment}
          editComment={handleEditComment}
          isDarkMode={isDarkMode}
          currentUser={currentUser}
        />
      ))}
    </div>
  );
};

export default CommentSection;