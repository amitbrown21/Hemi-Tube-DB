const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now, // Set the default to the current date
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
