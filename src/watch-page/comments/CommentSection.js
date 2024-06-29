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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (comments) {
      setIsLoading(false);
    }
  }, [comments]);

  const handleAddComment = async (newComment) => {
    try {
      const token = sessionStorage.getItem('token');
      
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
  
      setComments(prevComments => [result, ...prevComments]);
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to add comment. Please try again.");
    }
  };
  
  const handleDeleteComment = async (commentId) => {
    try {
      const token = sessionStorage.getItem('token');
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

      setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError("Failed to delete comment. Please try again.");
    }
  };

  const handleEditComment = async (commentId, newBody) => {
    try {
      const token = sessionStorage.getItem('token');
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
      setComments(prevComments => prevComments.map(comment => 
        comment._id === commentId ? result : comment
      ));
    } catch (error) {
      console.error("Error editing comment:", error);
      setError("Failed to edit comment. Please try again.");
    }
  };

  if (isLoading) {
    return <div>Loading comments...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="comment-section">
      <div className="comment-header">
        <h3>Comments ({comments.length})</h3>
        <SubmitComment
          currentUser={currentUser}
          addComment={handleAddComment}
        />
      </div>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            deleteComment={handleDeleteComment}
            editComment={handleEditComment}
            isDarkMode={isDarkMode}
            currentUser={currentUser}
          />
        ))
      ) : (
        <p>No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
};

export default CommentSection;