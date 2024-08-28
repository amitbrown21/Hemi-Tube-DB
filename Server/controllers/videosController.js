const videosServices = require("../services/videosServices");
const net = require("net");

function sendToCppServer(userId, videoId, command, callback) {
  const client = new net.Socket();
  const message = `${command} ${userId} ${videoId}`;

  client.connect(5557, "127.0.0.1", () => {
    console.log("Sending to C++ server:", message);
    client.write(message);
  });

  client.on("data", (data) => {
    console.log("Received from C++ server:", data.toString());
    if (callback) {
      callback(data.toString()); // Pass the response to the callback
    }
    client.destroy(); // Close the connection after receiving a response
  });

  client.on("error", (err) => {
    console.error("Error communicating with C++ server:", err);
  });

  client.on("close", () => {
    console.log("Connection to C++ server closed");
  });
}


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
        owner: userId,
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
      const userId = req.body.userId || "Guest";

      const updatedVideo = await videosServices.incrementViews(videoId);

      // Send a message to the C++ server
      //sendToCppServer(userId, videoId, "WATCH");

      sendToCppServer(userId, videoId, "WATCH", (response) => {
        console.log("Response from C++ server after WATCH command:", response);
      });

      sendToCppServer(userId, videoId, "RECOMMEND", (response) => {
        console.log(
          "Response from C++ server after RECOMMEND command:",
          response
        );
      });


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
    // New method
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
    // New method
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
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = videosController;
