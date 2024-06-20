const Video = require('../models/Video');

const commentServices = {
  getCommentsByVideoId: async (videoId) => {
    const video = await Video.findById(videoId);
    return video ? video.comments : [];
  },

  createComment: async (videoId, commentData) => {
    const video = await Video.findById(videoId);
    if (!video) throw new Error('Video not found');
    video.comments.push(commentData);
    await video.save();
    return video.comments[video.comments.length - 1];
  },

  getCommentById: async (videoId, commentId) => {
    const video = await Video.findById(videoId);
    return video ? video.comments.id(commentId) : null;
  },

  updateComment: async (videoId, commentId, updateData) => {
    const video = await Video.findById(videoId);
    if (!video) throw new Error('Video not found');
    const comment = video.comments.id(commentId);
    if (!comment) throw new Error('Comment not found');
    Object.assign(comment, updateData);
    await video.save();
    return comment;
  },

  deleteComment: async (videoId, commentId) => {
    const video = await Video.findById(videoId);
    if (!video) throw new Error('Video not found');
    video.comments.id(commentId).remove();
    await video.save();
    return { message: 'Comment deleted successfully' };
  },
};

module.exports = commentServices;