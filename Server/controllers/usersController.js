const usersServices = require("../services/usersServices");
const tokensServices = require("../services/tokensServices");

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
      if (error.message === "Username is already taken") {
        return res.status(400).json({ message: "Username is already taken" });
      }
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

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      console.log("Login attempt for username:", username);

      const { token, userId } = await tokensServices.createToken(
        username,
        password
      );

      console.log("Login successful for user:", userId);
      res.json({ token, userId });
    } catch (error) {
      console.error("Login error:", error.message);
      console.error("Stack trace:", error.stack);
      res.status(401).json({ message: "Invalid username or password" });
    }
  },
  verifyToken: async (req, res) => {
    // If the request reaches here, the token is valid (thanks to authMiddleware)
    res.json({ userId: req.userId });
  },
};

module.exports = usersController;
