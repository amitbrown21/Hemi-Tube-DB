const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const videosController = require("../controllers/videosController");
const commentController = require("../controllers/commentController");
const authMiddleware = require("../middleware/auth");

// Public routes
router.post("/", usersController.createUser);
router.post("/login", usersController.login);
router.get("/:id", usersController.getUserById); // Made public
router.get("/:id/videos", usersController.getUserVideos); // Made public
router.get("/:id/videos/:pid", videosController.getVideoById); // Made public
router.get("/:id/videos/:pid/comments", commentController.getCommentsByVideoId); // Made public

// Protected routes
router.get("/verify-token", authMiddleware, usersController.verifyToken);
router.get("/", authMiddleware, usersController.getAllUsers);
router.put("/:id", authMiddleware, usersController.updateUser);
router.delete("/:id", authMiddleware, usersController.deleteUser);

// Video routes under a user
router.post("/:id/videos", authMiddleware, videosController.createVideo);
router.put("/:id/videos/:pid", authMiddleware, videosController.updateVideo);
router.delete("/:id/videos/:pid", authMiddleware, videosController.deleteVideo);

// Comment routes under a video of a user
router.post("/:id/videos/:pid/comments", authMiddleware, commentController.createComment);
router.get("/:id/videos/:pid/comments/:commentId", authMiddleware, commentController.getCommentById);
router.put("/:id/videos/:pid/comments/:commentId", authMiddleware, commentController.updateComment);
router.delete("/:id/videos/:pid/comments/:commentId", authMiddleware, commentController.deleteComment);

module.exports = router;