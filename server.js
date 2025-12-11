const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));


// Connect MongoDB
mongoose
    .connect('mongodb://localhost:27017/skillfinder', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));


// Routes
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/posts', require('./routes/postRoutes'));


// Start Server
app.listen(4000, () => console.log('Server running on port 4000'));