const express = require('express');
const router = express.Router();
const User = require('../models/User');


// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        user = new User({ name, email, password });
        await user.save();

        // Log in immediately
        req.session.userId = user._id;
        res.json({ message: 'User registered', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        req.session.userId = user._id;
        res.json({ message: 'Logged in successfully', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ error: 'Could not log out' });
        res.json({ message: 'Logged out' });
    });
});


router.get('/all', async (req, res) => {
    const users = await User.find();
    res.json(users);
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update User Profile
router.put('/:id', async (req, res) => {
    try {
        console.log('[PUT] Update Profile Request. ID:', req.params.id);
        console.log('[PUT] Body:', req.body);
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        // Authentication Check
        if (!req.session.userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Authorization Check
        if (req.session.userId !== req.params.id) {
            return res.status(403).json({ error: 'You can only update your own profile' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true, runValidators: true }
        ).select('-password'); // Exclude password from result

        res.json({ message: 'Profile updated', user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
