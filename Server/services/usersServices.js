const User = require("../models/userModel");

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const getUsers = async () => {
  return await User.find();
};

const getUserById = async (id) => {
  return await User.findById(id);
};

const updateUser = async (id, updateData) => {
  return await User.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

const getUserVideos = async (id) => {
  const user = await User.findById(id).populate("videosID");
  return user ? user.videosID : [];
};

const getUserByUsername = async (username) => {
  return await User.findOne({ username });
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserVideos,
  getUserByUsername,
};