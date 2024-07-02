const User = require("../models/userModel");
const Video = require("../models/videoModel");

const createUser = async (userData) => {
  try {
    const existingUser = await User.findOne({ username: userData.username });
    if (existingUser) {
      throw new Error("Username is already taken");
    }
    const user = new User(userData);
    await user.save();
    return user;
  } catch (error) {
    console.error("Error creating user in usersServices:", error);
    throw error;
  }
};

const getUsers = async () => {
  try {
    return await User.find();
  } catch (error) {
    console.error("Error fetching users in usersServices:", error);
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    return await User.findById(id);
  } catch (error) {
    console.error("Error fetching user by ID in usersServices:", error);
    throw error;
  }
};

const getUserByUsername = async (username) => {
  try {
    return await User.findOne({ username });
  } catch (error) {
    console.error("Error fetching user by username in usersServices:", error);
    throw error;
  }
};

const updateUser = async (id, updateData) => {
  try {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  } catch (error) {
    console.error("Error updating user in usersServices:", error);
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    const user = await User.findByIdAndDelete(id);
    if (user) {
      await Video.deleteMany({ owner: user._id });
    }
    return user;
  } catch (error) {
    console.error("Error deleting user in usersServices:", error);
    throw error;
  }
};

const getUserVideos = async (userId) => {
  try {
    return await Video.find({ owner: userId });
  } catch (error) {
    console.error("Error fetching user videos in usersServices:", error);
    throw error;
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getUserByUsername,
  updateUser,
  deleteUser,
  getUserVideos,
};
