const Video = require("../models/videoModel");
const User = require("../models/userModel");

const createVideo = async (userId, videoData) => {
  const video = new Video({
    ...videoData,
    owner: userId
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
  return await Video.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
};

const incrementLikes = async (id) => {
  return await Video.findByIdAndUpdate(id, { $inc: { likes: 1 } }, { new: true });
};

const incrementDislikes = async (id) => {
  return await Video.findByIdAndUpdate(id, { $inc: { dislikes: 1 } }, { new: true });
};

module.exports = {
  createVideo,
  getVideos,
  getVideoById,
  updateVideo,
  deleteVideo,
  incrementViews,
  incrementLikes,
  incrementDislikes,
};