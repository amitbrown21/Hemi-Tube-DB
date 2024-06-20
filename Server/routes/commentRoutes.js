const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

router.get("/:videoId", commentController.getCommentsByVideoId);
router.post("/", commentController.createComment);
router.get("/:id", commentController.getCommentById);
router.put("/:id", commentController.updateComment);
router.delete("/:id", commentController.deleteComment);

module.exports = router;