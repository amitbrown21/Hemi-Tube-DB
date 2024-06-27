const usersServices = require("../services/usersServices");

const usersController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await usersServices.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getUserById: async (req, res) => {
    try {
      const user = await usersServices.getUserById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getUserByUsername: async (req, res) => {
    try {
      const user = await usersServices.getUserByUsername(req.params.username);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  createUser: async (req, res) => {
    try {
      const newUser = await usersServices.createUser(req.body);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const updatedUser = await usersServices.updateUser(
        req.params.id,
        req.body
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const deletedUser = await usersServices.deleteUser(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getUserVideos: async (req, res) => {
    try {
      const videos = await usersServices.getUserVideos(req.params.id);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = usersController;
