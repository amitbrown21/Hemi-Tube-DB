const videosServices = require("../services/videosServices");

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

  createVideo: async (req, res) => {
    try {
      const userId = req.params.id;
      const { title, description, url, thumbnail, duration } = req.body;
  
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const newVideo = await videosServices.createVideo(userId, {
        title,
        description,
        url,
        thumbnail,
        duration,
        owner: userId
      });
  
      res.status(201).json(newVideo);
    } catch (error) {
      console.error("Error creating video:", error);
      res.status(400).json({ message: error.message });
    }
  },

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
