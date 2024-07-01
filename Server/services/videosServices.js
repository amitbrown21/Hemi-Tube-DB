const Video = require("../models/videoModel");
const User = require("../models/userModel");

const createVideo = async (userId, videoData) => {
  const video = new Video({
    ...videoData,
    owner: userId,
  });
  await video.save();
  await User.findByIdAndUpdate(userId, { $push: { videosID: video._id } });
  return video;
};

const getVideos = async () => {
  return await Video.find();
};

const getVideoById = async (id) => {
  return await Video.findById(id);
};

const updateVideo = async (id, updateData) => {
  return await Video.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteVideo = async (id) => {
  const video = await Video.findByIdAndDelete(id);
  if (video) {
    await User.findByIdAndUpdate(video.owner, {
      $pull: { videosID: video._id },
    });
  }
  return video;
};

const incrementViews = async (id) => {
  return await Video.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    { new: true }
  );
};

const incrementLikes = async (id) => {
  return await Video.findByIdAndUpdate(
    id,
    { $inc: { likes: 1 } },
    { new: true }
  );
};

const decrementLikes = async (id) => {
  // New method
  return await Video.findByIdAndUpdate(
    id,
    { $inc: { likes: -1 } },
    { new: true }
  );
};

const incrementDislikes = async (id) => {
  return await Video.findByIdAndUpdate(
    id,
    { $inc: { dislikes: 1 } },
    { new: true }
  );
};

const decrementDislikes = async (id) => {
  // New method
  return await Video.findByIdAndUpdate(
    id,
    { $inc: { dislikes: -1 } },
    { new: true }
  );
};

const getVideosWithTopAndRandom = async () => {
  const allVideos = await Video.find().populate("owner", "username");

  // Sort videos by views in descending order
  allVideos.sort((a, b) => b.views - a.views);

  // Get top 10 videos
  const topVideos = allVideos.slice(0, 10);

  // Shuffle remaining videos
  const remainingVideos = allVideos.slice(10);
  for (let i = remainingVideos.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [remainingVideos[i], remainingVideos[j]] = [
      remainingVideos[j],
      remainingVideos[i],
    ];
  }

  return {
    topVideos,
    otherVideos: remainingVideos.slice(0, 10), // Return only 10 random videos
  };
};

module.exports = {
  createVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  incrementViews,
  incrementLikes,
  decrementLikes,
  incrementDislikes,
  decrementDislikes,
  getVideosWithTopAndRandom,
};
