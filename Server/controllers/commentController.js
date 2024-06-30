const commentServices = require("../services/commentServices");

const commentController = {
  getCommentsByVideoId: async (req, res) => {
    try {
      const comments = await commentServices.getCommentsByVideoId(
        req.params.pid
      );
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  createComment: async (req, res) => {
    try {
      const videoId = req.params.pid;
      const { body, username, profilePicture, userId } = req.body;

      console.log("Creating comment for video:", videoId);
      console.log("Comment data:", { body, username, profilePicture, userId });

      const newComment = await commentServices.createComment(videoId, {
        body,
        username,
        profilePicture,
        userId,
      });

      console.log("New comment created:", newComment);

      res.status(201).json(newComment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(400).json({ message: error.message });
    }
  },
  getCommentById: async (req, res) => {
    try {
      const comment = await commentServices.getCommentById(
        req.params.pid,
        req.params.commentId
      );
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      res.json(comment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateComment: async (req, res) => {
    try {
      const updatedComment = await commentServices.updateComment(
        req.params.pid,
        req.params.commentId,
        req.body
      );
      res.json(updatedComment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  deleteComment: async (req, res) => {
    try {
      const result = await commentServices.deleteComment(
        req.params.pid,
        req.params.commentId
      );
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = commentController;
