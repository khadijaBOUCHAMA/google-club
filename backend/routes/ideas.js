const express = require('express');
const router = express.Router();
const Idea = require('../models/Idea');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

// Get all ideas
router.get('/', async (req, res) => {
    try {
        const ideas = await Idea.find().populate('author', 'email').sort({ createdAt: -1 });
        res.json(ideas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new idea
router.post('/', authenticateToken, async (req, res) => {
    const { title, description, tags } = req.body;

    try {
        const idea = new Idea({
            title,
            description,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            author: req.user.id
        });

        const savedIdea = await idea.save();
        await savedIdea.populate('author', 'email');

        // Create notification for new idea
        const Notification = require('../models/Notification');
        const users = await User.find({ _id: { $ne: req.user.id } }); // All users except the author

        for (const user of users) {
            const notification = new Notification({
                user: user._id,
                type: 'idea',
                title: 'New Idea Posted',
                message: `${req.user.email} shared a new idea: "${title}"`,
                data: { ideaId: savedIdea._id }
            });
            await notification.save();
        }

        res.status(201).json(savedIdea);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get ideas by user
router.get('/user/:userId', async (req, res) => {
    try {
        const ideas = await Idea.find({ author: req.params.userId }).populate('author', 'email');
        res.json(ideas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
