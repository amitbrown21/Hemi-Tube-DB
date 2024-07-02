const mongoose = require("mongoose");
const User = require("../models/userModel"); // Adjust path as needed
const Video = require("../models/videoModel"); // Adjust path as needed

mongoose
  .connect("mongodb://localhost:27017/HemiTubeShonAndAmit", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

const videos = [
  { title: "Ad", filename: "ad" },
  { title: "Cat", filename: "cat" },
  { title: "Coke", filename: "coke" },
  { title: "Countdown", filename: "countdown" },
  { title: "Daniel", filename: "daniel" },
  { title: "Days", filename: "days" },
  { title: "Doc", filename: "doc" },
  { title: "Doggo", filename: "doggo" },
  { title: "Funny", filename: "funny" },
  { title: "Imagine", filename: "imagine" },
  { title: "Loop", filename: "loop" },
  { title: "Milky", filename: "milky" },
  { title: "Minecraft", filename: "Minecraft" },
  { title: "Music", filename: "music" },
  { title: "Open", filename: "open" },
  { title: "Pizza", filename: "pizza" },
  { title: "Poem", filename: "poem" },
  { title: "Relax", filename: "relax" },
  { title: "Sunset", filename: "sunset" },
  { title: "Timer", filename: "timer" },
  { title: "Toast", filename: "toast" },
  { title: "Wait", filename: "wait" },
];

async function uploadVideos() {
  try {
    const users = await User.find();
    if (users.length === 0) {
      throw new Error(
        "No users found. Please run the uploadUsers script first."
      );
    }

    for (let video of videos) {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      const newVideo = new Video({
        url: `/assets/videos/${video.filename}.mp4`,
        title: video.title,
        owner: randomUser._id,
        thumbnail: `/assets/thumbnails/${video.filename}.jpg`,
        description: `This is a video about ${video.title.toLowerCase()}.`,
        duration: "0:30", // Placeholder duration
        views: Math.floor(Math.random() * 10000),
        likes: Math.floor(Math.random() * 1000),
        dislikes: Math.floor(Math.random() * 100),
      });

      await newVideo.save();

      // Update the user's videosID array
      await User.findByIdAndUpdate(randomUser._id, {
        $push: { videosID: newVideo._id },
      });

      console.log(`Uploaded video: ${video.title}`);
    }

    console.log("All videos uploaded successfully");
  } catch (error) {
    console.error("Error uploading videos:", error);
  } finally {
    mongoose.connection.close();
  }
}

uploadVideos();
