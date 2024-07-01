const express = require("express");
const router = express.Router();
const videosController = require("../controllers/videosController");

router.get("/", videosController.getAllVideosWithTopAndRandom);
router.post("/:pid/incrementViews", videosController.incrementViews);
router.post("/:pid/incrementLikes", videosController.incrementLikes);
router.post("/:pid/decrementLikes", videosController.decrementLikes);
router.post("/:pid/incrementDislikes", videosController.incrementDislikes);
router.post("/:pid/decrementDislikes", videosController.decrementDislikes);
router.get("/all", videosController.getAllVideos);
router.get("/:pid", videosController.getVideoById);

module.exports = router;
