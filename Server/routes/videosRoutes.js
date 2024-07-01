const express = require("express");
const router = express.Router();
const videosController = require("../controllers/videosController");


router.get("/", videosController.getAllVideosWithTopAndRandom);
router.post("/:pid/incrementViews", videosController.incrementViews);
router.post("/:pid/incrementLikes", videosController.incrementLikes);
router.post("/:pid/incrementDislikes", videosController.incrementDislikes);
router.get("/all", videosController.getAllVideos);
module.exports = router;