const videosServices = require("../services/videosServices");
const multer = require("multer");
const path = require("path");
const authMiddleware = require("./authMiddleware");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const videosController = {
  getAllVideos: async (req, res) => {
    try {
      const videos = await videosServices.getVideos();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getVideoById: async (req, res) => {
    try {
      const video = await videosServices.getVideoById(req.params.pid);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.json(video);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createVideo: [
    authMiddleware,
    upload.fields([
      { name: "video", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    async (req, res) => {
      try {
        const videoData = {
          title: req.body.title,
          description: req.body.description,
          url: req.files.video[0].path,
          thumbnail: req.files.thumbnail[0].path,
          duration: req.body.duration,
          owner: req.user._id,
          date: new Date(),
        };

        const newVideo = await videosServices.createVideo(req.user._id, videoData);
        res.status(201).json(newVideo);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    },
  ],

  updateVideo: async (req, res) => {
    try {
      const updatedVideo = await videosServices.updateVideo(
        req.params.pid,
        req.body
      );
      if (!updatedVideo) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.json(updatedVideo);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteVideo: async (req, res) => {
    try {
      const deletedVideo = await videosServices.deleteVideo(req.params.pid);
      if (!deletedVideo) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.json({ message: "Video deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = videosController;