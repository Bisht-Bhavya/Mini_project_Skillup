const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Create a Post
router.post('/create', async (req, res) => {
    try {
        const post = new Post(req.body);
        await post.save();
        res.json({ message: 'Post created successfully', post });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all Posts (Feed)
router.get('/all', async (req, res) => {
    try {
        // Sort by newest first
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Posts by User
router.get('/user/:userId', async (req, res) => {
    try {
        const posts = await Post.find({ authorId: req.params.userId }).sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
