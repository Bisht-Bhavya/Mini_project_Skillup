const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: String,
    description: String,
    tags: [String], // Skills/Achievements tags
    authorId: String,
    authorName: String, // Denormalized for simpler display
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);
