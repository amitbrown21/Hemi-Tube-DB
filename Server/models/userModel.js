const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  profilePicture: {
    type: String,
    required: true,
  },
  subscribers: {
    type: String,
    required: true,
  },
  videosID: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Video",
    default: [],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
