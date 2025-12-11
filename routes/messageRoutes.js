const express = require('express');
const router = express.Router();
const Message = require('../models/Message');


router.post('/send', async (req, res) => {
const message = new Message(req.body);
await message.save();
res.json({ message: 'Message sent', data: message });
});


router.get('/:senderId/:receiverId', async (req, res) => {
const { senderId, receiverId } = req.params;
const messages = await Message.find({
senderId,
receiverId
});
res.json(messages);
});


module.exports = router;