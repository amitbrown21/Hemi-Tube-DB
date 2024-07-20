const videosServices = require("../services/videosServices");
const Video = require("../models/videoModel");
const path = require("path");

const videosController = {
  getAllVideos: async (req, res) => {
    try {
      const videos = await Video.find().populate(
        "owner",
        "username profilePicture"
      );
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getVideoById: async (req, res) => {
    try {
      const video = await Video.findById(req.params.id).populate(
        "owner",
        "username profilePicture"
      );
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.json(video);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createVideo: async (req, res) => {
    try {
      console.log("Request received to create video with body:", req.body);
      console.log("Files received:", req.files);

      const userId = req.body.userId; // This should now be a simple string
      const title = req.body.title;
      const description = req.body.description;
      const url = req.files.video
        ? path.normalize(req.files.video[0].path).replace(/\\/g, "/")
        : null;
      const thumbnail = req.files.thumbnail
        ? path.normalize(req.files.thumbnail[0].path).replace(/\\/g, "/")
        : null;

      if (!userId || !title || !description || !url || !thumbnail) {
        console.log("Missing fields in request");
        return res.status(400).json({ message: "Missing required fields" });
      }

      const newVideo = await videosServices.createVideo(userId, {
        title,
        description,
        url,
        thumbnail,
        duration: "00:00",
      });

      res.status(201).json(newVideo);
    } catch (error) {
      console.error("Error creating video:", error);
      res.status(400).json({ message: error.message });
    }
  },

  updateVideo: async (req, res) => {
    try {
      const userId = req.user.userId; // Get the authenticated user's ID
      const videoId = req.params.pid;

      const video = await videosServices.getVideoById(videoId);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }

      // Check if the authenticated user is the owner of the video
      if (video.owner.toString() !== userId) {
        return res
          .status(403)
          .json({ message: "You are not authorized to edit this video" });
      }

      const updatedVideo = await videosServices.updateVideo(videoId, req.body);
      res.json(updatedVideo);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteVideo: async (req, res) => {
    try {
      const userId = req.user.userId; // Get the authenticated user's ID
      const videoId = req.params.pid;

      const video = await videosServices.getVideoById(videoId);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }

      // Check if the authenticated user is the owner of the video
      if (video.owner.toString() !== userId) {
        return res
          .status(403)
          .json({ message: "You are not authorized to delete this video" });
      }

      await videosServices.deleteVideo(videoId);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  incrementViews: async (req, res) => {
    try {
      const videoId = req.params.pid;
      const updatedVideo = await videosServices.incrementViews(videoId);
      res.json(updatedVideo);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  incrementLikes: async (req, res) => {
    try {
      const videoId = req.params.pid;
      const updatedVideo = await videosServices.incrementLikes(videoId);
      res.json(updatedVideo);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  decrementLikes: async (req, res) => {
    try {
      const videoId = req.params.pid;
      const updatedVideo = await videosServices.decrementLikes(videoId);
      res.json(updatedVideo);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  incrementDislikes: async (req, res) => {
    try {
      const videoId = req.params.pid;
      const updatedVideo = await videosServices.incrementDislikes(videoId);
      res.json(updatedVideo);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  decrementDislikes: async (req, res) => {
    try {
      const videoId = req.params.pid;
      const updatedVideo = await videosServices.decrementDislikes(videoId);
      res.json(updatedVideo);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAllVideosWithTopAndRandom: async (req, res) => {
    try {
      const videos = await videosServices.getVideosWithTopAndRandom();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAllVideos: async (req, res) => {
    try {
      const videos = await Video.find().populate("owner", "username");
      res.json(videos);
    } catch (error) {
      console.error("Error fetching all videos:", error); // Log error details
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = videosController;
