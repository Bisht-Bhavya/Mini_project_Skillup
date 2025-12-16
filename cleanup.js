const mongoose = require('mongoose');
require('dotenv').config();
const Post = require('./models/Post');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error('MONGO_URI environment variable is not set. Set it before running cleanup.');
    process.exit(1);
}

mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('MongoDB Connected for Cleanup');

        // Delete posts with undefined title or unknown author
        const res = await Post.deleteMany({
            $or: [
                { title: { $exists: false } },
                { title: null },
                { title: '' },
                { authorName: 'Unknown' },
                { authorName: 'Anonymous' }
            ]
        });

        console.log(`Deleted ${res.deletedCount} invalid posts.`);
        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
