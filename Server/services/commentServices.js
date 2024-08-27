const Video = require("../models/videoModel");
const Comment = require("../models/commentModel");

const commentServices = {
  createComment: async (commentData) => {
    const video = await Video.findById(commentData.videoId);
    if (!video) throw new Error("Video not found");

    const comment = new Comment({
      ...commentData,
    });

    const savedComment = await comment.save();

    // Add the comment to the video's comments array
    video.comments.push(savedComment._id);
    await video.save();

    return savedComment;
  },

  getCommentById: async (videoId, commentId) => {
    const video = await Video.findById(videoId).populate("comments");
    if (!video) return null;
    const comment = video.comments.find((c) => c._id.equals(commentId));
    return comment || null;
  },

  getCommentsByVideoId: async (videoId) => {
    const video = await Video.findById(videoId).populate({
      path: "comments",
      options: { sort: { date: -1 } },
    });
    if (!video) throw new Error("Video not found");
    return video.comments;
  },

  updateComment: async (videoId, commentId, updateData) => {
    const video = await Video.findById(videoId).populate("comments");
    if (!video) throw new Error("Video not found");
    const comment = video.comments.find((c) => c._id.equals(commentId));
    if (!comment) throw new Error("Comment not found");
    Object.assign(comment, updateData);
    await comment.save();
    return comment;
  },

  deleteComment: async (videoId, commentId) => {
    const video = await Video.findById(videoId).populate("comments");
    if (!video) throw new Error("Video not found");
    const commentIndex = video.comments.findIndex((c) =>
      c._id.equals(commentId)
    );
    if (commentIndex === -1) throw new Error("Comment not found");
    const comment = video.comments[commentIndex];
    video.comments.splice(commentIndex, 1);
    await video.save();
    await Comment.findByIdAndDelete(commentId);
    return { message: "Comment deleted successfully" };
  },
};

module.exports = commentServices;