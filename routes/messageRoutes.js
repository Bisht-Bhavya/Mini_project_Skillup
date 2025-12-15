const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.use(isAuthenticated);

router.post('/send', async (req, res) => {
    const message = new Message(req.body);
    await message.save();
    res.json({ message: 'Message sent', data: message });
});


router.get('/:user1Id/:user2Id', async (req, res) => {
    const { user1Id, user2Id } = req.params;
    try {
        const messages = await Message.find({
            $or: [
                { senderId: user1Id, receiverId: user2Id },
                { senderId: user2Id, receiverId: user1Id }
            ]
        }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Get recent conversations
router.get('/conversations/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        // Find all messages where user is sender OR receiver
        const messages = await Message.find({
            $or: [{ senderId: userId }, { receiverId: userId }]
        }).sort({ timestamp: -1 });

        const contacts = new Map();

        messages.forEach(msg => {
            const isSender = msg.senderId === userId;
            const contactId = isSender ? msg.receiverId : msg.senderId;
            const contactName = isSender ? 'Unknown' : msg.senderName; // We might need to fetch names if "Unknown" persists, but let's try this. 
            // Actually, if I sent it, I might not know receiver name here easily without join. 
            // Better approach: just collect IDs and fetch users? 
            // Or just trust the frontend to fetch user details if name missing?
            // Let's keep it simple: Map ID -> { id, lastMsg, time }

            if (!contacts.has(contactId)) {
                contacts.set(contactId, {
                    id: contactId,
                    lastMessage: msg.content,
                    timestamp: msg.timestamp,
                    name: contactName // This might be "Unknown" if I sent the last msg. Frontend handles?
                });
            }
        });

        const conversationList = Array.from(contacts.values());
        res.json(conversationList);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;