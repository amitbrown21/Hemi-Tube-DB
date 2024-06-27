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
    set: (value) => {
      const [month, day, year] = value.split("/").map(Number);
      return new Date(year + 2000, month - 1, day);
    },
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
