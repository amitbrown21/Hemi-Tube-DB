const videosServices = require("../services/videosServices");
const Video = require("../models/videoModel");
const path = require("path");

const videosController = {
  getAllVideos: async (req, res) => {
    try {
      console.log("Fetching all videos from database...");
      const videos = await Video.find().populate(
        "owner",
        "username profilePicture"
      );

      if (videos && videos.length > 0) {
        videos.forEach((video, index) => {
          console.log(`Video ${index + 1}:`, video);
        });
      } else {
        console.log("No videos found in the database.");
      }

      res.json(videos);
    } catch (error) {
      console.error("Error fetching all videos:", error); // Log error details
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
            duration: req.body.duration,
        });

        res.status(201).json(newVideo);
    } catch (error) {
        console.error("Error creating video:", error);
        res.status(400).json({ message: error.message });
    }
},


  updateVideo: async (req, res) => {
    try {
      const userId = req.params.id; // Get the authenticated user's ID
      const videoId = req.params.pid;

      console.log("Updating video with  user ID:", req.params.id);

      console.log("Authenticated user ID:", userId);
      console.log("Video ID to update:", videoId);

      const video = await videosServices.getVideoById(videoId);
      if (!video) {
        console.log("Video not found:", videoId);
        return res.status(404).json({ message: "Video not found" });
      }

      console.log("video Owner", video.owner._id.toString());

      if (video.owner._id.toString() !== userId) {
        console.log("User not authorized to edit video:", userId);
        return res
          .status(403)
          .json({ message: "You are not authorized to edit this video" });
      }

      const updateData = {
        title: req.body.title,
        description: req.body.description,
      };

      if (req.file) {
        updateData.thumbnail = path
          .normalize(req.file.path)
          .replace(/\\/g, "/");
        console.log("Thumbnail path:", updateData.thumbnail);
      } else {
        console.log("No thumbnail file provided");
      }

      console.log("Update data:", updateData);

      const updatedVideo = await videosServices.updateVideo(
        videoId,
        updateData
      );
      res.json(updatedVideo);
    } catch (error) {
      console.error("Error updating video:", error);
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
      if (!updatedVideo) {
        return res.status(404).json({ message: "Video not found" });
      }
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
};

module.exports = videosController;