import React, { useState, useEffect } from "react";
import "./comments.css";
import SubmitComment from "./SubmitComment";
import Comment from "./Comment";

const CommentSection = ({
  currentUser,
  videoId,
  videos,
  setVideos,
  isDarkMode,
}) => {
  const [commentList, setCommentList] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/users/${videos.find(v => v._id === videoId).owner}/videos/${videoId}/comments`
        );

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Failed to fetch comments");
        }

        const comments = await res.json();
        setCommentList(comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [videoId, videos]);

  const updateVideoComments = (videoId, newComments) => {
    const updatedVideos = videos.map((video) => {
      if (video._id === videoId) {
        return { ...video, comments: newComments };
      }
      return video;
    });
    setVideos(updatedVideos);
  };

  const handleAddComment = async (newComment) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:3000/api/users/${videos.find(v => v._id === videoId).owner}/videos/${videoId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(newComment),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to add comment");
      }

      const result = await res.json();
      const updatedComments = [result, ...commentList];
      setCommentList(updatedComments);
      updateVideoComments(videoId, updatedComments);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:3000/api/users/${videos.find(v => v._id === videoId).owner}/videos/${videoId}/comments/${commentId}`,
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
      updateVideoComments(videoId, updatedComments);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleEditComment = async (commentId, newBody) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `http://localhost:3000/api/users/${videos.find(v => v._id === videoId).owner}/videos/${videoId}/comments/${commentId}`,
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
      updateVideoComments(videoId, updatedComments);
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