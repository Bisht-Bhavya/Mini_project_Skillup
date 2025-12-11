const express = require('express');
const router = express.Router();
const Gig = require('../models/Gig');

// Create a Gig
router.post('/create', async (req, res) => {
    try {
        const gig = new Gig(req.body);
        await gig.save();
        res.json({ message: 'Gig created successfully', gig });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all Gigs
router.get('/all', async (req, res) => {
    try {
        const gigs = await Gig.find();
        res.json(gigs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Gig by ID
router.get('/:id', async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id);
        res.json(gig);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
