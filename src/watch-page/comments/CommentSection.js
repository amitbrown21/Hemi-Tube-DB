import React, { useState, useEffect } from "react";
import "./comments.css";
import SubmitComment from "./SubmitComment";
import Comment from "./Comment";

const CommentSection = ({
  currentUser,
  videoId,
  comments,
  videos,
  setVideos,
  isDarkMode,
}) => {
  const [commentList, setCommentList] = useState(comments);

  useEffect(() => {
    setCommentList(comments);
  }, [comments]);

  const updateVideoComments = (videoId, newComments) => {
    const updatedVideos = videos.map((video) => {
      if (video.id === videoId) {
        return { ...video, comments: newComments };
      }
      return video;
    });
    setVideos(updatedVideos);
  };

  const handleAddComment = (newComment) => {
    const updatedComments = [newComment, ...commentList];
    setCommentList(updatedComments);
    updateVideoComments(videoId, updatedComments);
  };

  const handleDeleteComment = (commentId) => {
    const updatedComments = commentList.filter(
      (comment) => comment.id !== commentId
    );
    setCommentList(updatedComments);
    updateVideoComments(videoId, updatedComments);
  };

  const handleEditComment = (commentId, newBody) => {
    const updatedComments = commentList.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, body: newBody };
      }
      return comment;
    });
    setCommentList(updatedComments);
    updateVideoComments(videoId, updatedComments);
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
      {commentList.map((comment, index) => (
        <Comment
          key={index}
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
