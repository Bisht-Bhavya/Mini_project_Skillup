const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');


const app = express();
const session = require('express-session');
require('dotenv').config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Config
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // true in production
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));


// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));


// Connect MongoDB
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error('MONGO_URI environment variable is not set. Set MONGO_URI to your MongoDB connection string.');
    process.exit(1);
}
mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    });

// Routes
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/posts', require('./routes/postRoutes'));


// Start Server
const PORT = process.env.PORT || 0;
const server = app.listen(PORT, () => {
    const actualPort = server.address && server.address().port ? server.address().port : PORT;
    console.log(`Server running on port ${actualPort}`);
});