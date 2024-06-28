const express = require("express");
const router = express.Router();
const videosController = require("../controllers/videosController");
const authMiddleware = require("../middleware/auth");

router.get("/", videosController.getAllVideos);
router.post("/", authMiddleware, videosController.createVideo);
router.get("/:id", videosController.getVideoById);
router.put("/:id", authMiddleware, videosController.updateVideo);
router.delete("/:id", authMiddleware, videosController.deleteVideo);

module.exports = router;