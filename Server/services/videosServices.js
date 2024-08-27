const Video = require("../models/videoModel");

const videosServices = {
  getAllVideos: async () => {
    return await Video.find().populate("owner", "username profilePicture");
  },

  getVideoById: async (id) => {
    return await Video.findById(id).populate(
      "owner",
      "username profilePicture"
    );
  },

  createVideo: async (userId, videoData) => {
    const video = new Video({ ...videoData, owner: userId });
    return await video.save();
  },

  updateVideo: async (videoId, updateData) => {
    const video = await Video.findByIdAndUpdate(videoId, updateData, {
      new: true,
    });
    return video;
  },

  deleteVideo: async (id) => {
    return await Video.findByIdAndDelete(id);
  },

  incrementViews: async (id) => {
    const video = await Video.findById(id);
    if (!video) {
      throw new Error("Video not found");
    }
    video.views += 1;
    return await video.save();
  },

  incrementLikes: async (videoId) => {
    const video = await Video.findById(videoId);
    if (!video) {
      throw new Error("Video not found");
    }
    video.likes += 1;
    return await video.save();
  },

  decrementLikes: async (videoId) => {
    const video = await Video.findById(videoId);
    if (!video) {
      throw new Error("Video not found");
    }
    if (video.likes > 0) {
      video.likes -= 1;
    }
    return await video.save();
  },

  incrementDislikes: async (videoId) => {
    const video = await Video.findById(videoId);
    if (!video) {
      throw new Error("Video not found");
    }
    video.dislikes += 1;
    return await video.save();
  },

  decrementDislikes: async (videoId) => {
    const video = await Video.findById(videoId);
    if (!video) {
      throw new Error("Video not found");
    }
    if (video.dislikes > 0) {
      video.dislikes -= 1;
    }
    return await video.save();
  },

  getVideosWithTopAndRandom: async () => {
    const videos = await Video.find().populate(
      "owner",
      "username profilePicture"
    );
    const topVideos = videos.sort((a, b) => b.likes - a.likes).slice(0, 5);
    const otherVideos = videos.sort(() => 0.5 - Math.random()).slice(0, 10);
    return { topVideos, otherVideos };
  },
};

module.exports = videosServices;