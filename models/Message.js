const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    senderId: String,
    senderName: String, // Add for UI convenience
    receiverId: String,
    content: String, // Changed from message to content to match UI
    type: { type: String, default: 'text' }, // text, image, document
    replyTo: Object, // Specific structure for replies
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', MessageSchema);
