const mongoose = require('mongoose');
const Post = require('./models/Post');

mongoose
    .connect('mongodb://localhost:27017/skillfinder', { useNewUrlParser: true, useUnifiedTopology: true })
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
