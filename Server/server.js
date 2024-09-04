const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const usersRoutes = require("./routes/usersRoutes");
const videosRoutes = require("./routes/videosRoutes");
const net = require("net");
const videosServices = require("./services/videosServices");

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

// Function to send all videos to the C++ server
function initializeCppServerWithVideos(videos) {
  const client = new net.Socket();
  const message = `INIT ${videos.map((video) => video._id).join(" ")}`;

  client.connect(5557, "127.0.0.1", () => {
    console.log("Sending all videos to C++ server:", message);
    client.write(message);
  });

  client.on("data", (data) => {
    console.log("Received from C++ server:", data.toString());
    client.destroy(); // Close the connection after receiving a response
  });

  client.on("error", (err) => {
    console.error("Error communicating with C++ server:", err);
  });

  client.on("close", () => {
    console.log("Connection to C++ server closed");
  });
}

// Fetch all videos from the database and send to the C++ server
(async () => {
  try {
    const allVideos = await videosServices.getVideos();
    initializeCppServerWithVideos(allVideos);
  } catch (error) {
    console.error("Error initializing C++ server with videos:", error);
  }
})();

module.exports = app;
