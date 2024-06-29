const express = require("express");
const router = express.Router();
const videosController = require("../controllers/videosController");


router.get("/", videosController.getAllVideos);


module.exports = router;