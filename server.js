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
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skillfinder';
mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected to ' + (process.env.MONGO_URI ? 'Atlas' : 'Localhost')))
    .catch(err => console.log(err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/posts', require('./routes/postRoutes'));


// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));