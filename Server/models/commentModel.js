const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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
        // Assuming the date format is "MM/DD/YY"
        set: (value) => {
            // Convert string to Date object
            const [month, day, year] = value.split('/').map(Number);
            return new Date(year + 2000, month - 1, day);
        }
    }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;