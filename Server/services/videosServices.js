const Video = require('../models/videosModel');

const createVideo = async (videoData) => {
    const video = new Video(videoData);
    return await video.save();
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
    return await Video.findByIdAndDelete(id);
};

module.exports = {
    createVideo,
    getVideos,
    getVideoById,
    updateVideo,
    deleteVideo
};
