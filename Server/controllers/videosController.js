const videosServices = require('../services/videosServices');

const videosController = {
  getAllVideos: async (req, res) => {
    try {
      const videos = await videosServices.getAllVideos();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getVideoById: async (req, res) => {
    try {
      const video = await videosServices.getVideoById(req.params.id);
      if (!video) {
        return res.status(404).json({ message: 'Video not found' });
      }
      res.json(video);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createVideo: async (req, res) => {
    try {
      const newVideo = await videosServices.createVideo(req.body);
      res.status(201).json(newVideo);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateVideo: async (req, res) => {
    try {
      const updatedVideo = await videosServices.updateVideo(req.params.id, req.body);
      if (!updatedVideo) {
        return res.status(404).json({ message: 'Video not found' });
      }
      res.json(updatedVideo);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteVideo: async (req, res) => {
    try {
      const deletedVideo = await videosServices.deleteVideo(req.params.id);
      if (!deletedVideo) {
        return res.status(404).json({ message: 'Video not found' });
      }
      res.json({ message: 'Video deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Add more video-related controller methods as needed
};

module.exports = videosController;