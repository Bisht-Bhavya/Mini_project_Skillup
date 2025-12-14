const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User'); // Import User model
const multer = require('multer');
const path = require('path');

// Multer Storage
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, 'post-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50000000 }, // 50MB limit for videos
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|mp4|mov|avi|wmv/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images or Videos Only!');
    }
}

// Create a Post
router.post('/create', upload.single('media'), async (req, res) => {
    try {
        console.log('Create Post Body:', req.body);
        console.log('Create Post Request File:', req.file);

        let { title, description, tags, price } = req.body;

        // Robust Author Resolution: Use Session > Body
        let authorId = req.session.userId;
        let authorName = 'Anonymous';

        if (authorId) {
            const user = await User.findById(authorId);
            if (user) {
                authorName = user.name;
            } else {
                console.warn(`User with session ID ${authorId} not found.`);
            }
        } else {
            // Fallback for testing/manual calls (though insecure)
            authorId = req.body.authorId;
            authorName = req.body.authorName;
            console.warn('No session userId found, falling back to req.body for authorId/authorName. This is insecure for production.');
        }

        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        let mediaUrl = '';
        let mediaType = '';

        if (req.file) {
            mediaUrl = '/uploads/' + req.file.filename;
            if (req.file.mimetype.startsWith('image')) {
                mediaType = 'image';
            } else if (req.file.mimetype.startsWith('video')) {
                mediaType = 'video';
            }
        }

        const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];

        const post = new Post({
            title,
            description,
            tags: tagsArray,
            authorId,
            authorName,
            mediaUrl,
            mediaType
        });

        await post.save();
        res.json({ message: 'Post created successfully', post });
    } catch (err) {
        console.error('Create Post Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Delete a Post
router.delete('/:id', async (req, res) => {
    try {
        console.log(`[DELETE] Request for post ID: ${req.params.id}`);
        console.log(`[DELETE] Session User ID: ${req.session.userId}`);

        if (!req.session.userId) {
            console.warn('[DELETE] Unauthorized: No session user ID');
            return res.status(401).json({ error: 'Unauthorized: Please login again' });
        }

        const post = await Post.findById(req.params.id);

        if (!post) {
            console.warn('[DELETE] Post not found');
            return res.status(404).json({ error: 'Post not found' });
        }

        console.log(`[DELETE] Post Author ID: ${post.authorId}`);

        // Authorization: Only author can delete
        if (post.authorId.toString() !== req.session.userId.toString()) {
            console.warn('[DELETE] Forbidden: User mismatch');
            return res.status(403).json({ error: 'You can only delete your own posts' });
        }

        await Post.findByIdAndDelete(req.params.id);
        console.log('[DELETE] Success');
        res.json({ message: 'Post deleted' });
    } catch (err) {
        console.error('[DELETE] Error:', err);
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
