const commentServices = require('../services/commentServices');

const commentController = {
  getCommentsByVideoId: async (req, res) => {
    try {
      const comments = await commentServices.getCommentsByVideoId(req.params.videoId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createComment: async (req, res) => {
    try {
      const newComment = await commentServices.createComment(req.params.videoId, req.body);
      res.status(201).json(newComment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getCommentById: async (req, res) => {
    try {
      const comment = await commentServices.getCommentById(req.params.videoId, req.params.commentId);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
      res.json(comment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateComment: async (req, res) => {
    try {
      const updatedComment = await commentServices.updateComment(req.params.videoId, req.params.commentId, req.body);
      res.json(updatedComment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const result = await commentServices.deleteComment(req.params.videoId, req.params.commentId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = commentController;