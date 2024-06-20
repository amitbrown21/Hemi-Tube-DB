const express = require('express');
const mongoose = require('mongoose');
const usersRoutes = require('./routes/usersRoutes');
const videosRoutes = require('./routes/videosRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();

// Middleware
app.use(express.json());

// Database connection
mongoose.connect('mongodb://localhost:27017/yourDatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Could not connect to MongoDB', err));

// Routes
app.use('/api/users', usersRoutes);
app.use('/api/videos', videosRoutes);
app.use('/api/comments', commentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;