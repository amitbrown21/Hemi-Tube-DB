const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const videosController = require("../controllers/videosController");
const commentController = require("../controllers/commentController");

router.get("/:id", usersController.getUserById);
router.put("/:id", usersController.updateUser);
router.delete("/:id", usersController.deleteUser);
router.post("/", usersController.createUser);

router.get("/:id/videos", usersController.getUserVideos);
router.post("/:id/videos", videosController.createVideo);
router.get("/:id/videos/:pid", videosController.getVideoById);
router.put("/:id/videos/:pid", videosController.updateVideo);
router.delete("/:id/videos/:pid", videosController.deleteVideo);

// Assuming you have a commentController, if not, you'll need to create one
router.get("/:id/videos/:pid/comments", commentController.getCommentsByVideoId);
router.post("/:id/videos/:pid/comments", commentController.createComment);
router.get("/:id/videos/:pid/comments/:commentId", commentController.getCommentById);
router.put("/:id/videos/:pid/comments/:commentId", commentController.updateComment);
router.delete("/:id/videos/:pid/comments/:commentId", commentController.deleteComment);

module.exports = router;