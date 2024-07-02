import React, { useState, useEffect } from "react";
import Comment from "./Comment";
import SubmitComment from "./SubmitComment";

const CommentSection = ({ currentUser, videoId, videoOwner, isDarkMode }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommentsWithProfilePictures = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/users/${videoOwner}/videos/${videoId}/comments`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch comments");
        }

        const commentsData = await res.json();

        const commentsWithProfilePictures = await Promise.all(
          commentsData.map(async (comment) => {
            const userRes = await fetch(
              `http://localhost:3000/api/users/${comment.userId}`
            );
            const userData = await userRes.json();
            return { ...comment, profilePicture: userData.profilePicture };
          })
        );

        setComments(commentsWithProfilePictures);
      } catch (error) {
        console.error("Error fetching comments:", error);
        setError("Failed to fetch comments. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommentsWithProfilePictures();
  }, [videoId, videoOwner]);

  const handleAddComment = async (newComment) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/api/users/${videoOwner}/videos/${videoId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newComment),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to add comment");
      }

      const result = await res.json();
      const userRes = await fetch(
        `http://localhost:3000/api/users/${result.userId}`
      );
      const userData = await userRes.json();
      result.profilePicture = userData.profilePicture;
      setComments((prevComments) => [result, ...prevComments]);
    } catch (error) {
      console.error("Error adding comment:", error);
      setError("Failed to add comment. Please try again.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/api/users/${videoOwner}/videos/${videoId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete comment");
      }

      setComments((prevComments) =>
        prevComments.filter((comment) => comment._id !== commentId)
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
      setError("Failed to delete comment. Please try again.");
    }
  };

  const handleEditComment = async (commentId, newBody) => {
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/api/users/${videoOwner}/videos/${videoId}/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ body: newBody }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to edit comment");
      }

      const updatedComment = await res.json();
      const userRes = await fetch(
        `http://localhost:3000/api/users/${updatedComment.userId}`
      );
      const userData = await userRes.json();
      updatedComment.profilePicture = userData.profilePicture;
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment._id === commentId ? updatedComment : comment
        )
      );
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
