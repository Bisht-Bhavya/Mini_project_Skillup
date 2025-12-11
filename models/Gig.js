const mongoose = require('mongoose');

const GigSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    category: String,
    sellerId: String, // Ideally this would be an ObjectId ref 'User', but keeping it String for simplicity as per current pattern
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gig', GigSchema);
