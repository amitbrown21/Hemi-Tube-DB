const Comment = require('./commentModel');
const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    owner: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        set: (value) => {
            const [month, day, year] = value.split('/').map(Number);
            return new Date(year + 2000, month - 1, day);
        }
    },
    views: {
        type: Number,
        required: true,
        default: 0,
    },
    likes: {
        type: Number,
        required: true,
        default: 0,
    },
    dislikes: {
        type: Number,
        required: true,
        default: 0,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    comments: {
        type: [Comment],
        default: []
    }
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;