const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const usersRoutes = require("./routes/usersRoutes");
const videosRoutes = require("./routes/videosRoutes");

const app = express();

// JWT Secret
process.env.JWT_SECRET = "your_jwt_secret_here";

// Increase the payload limit to handle large Base64 strings
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose
  .connect("mongodb://localhost:27017/HemiTubeShonAndAmit", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Routes
app.use("/api/users", usersRoutes);
app.use("/api/videos", videosRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
