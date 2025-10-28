const express = require('express');
const router = express.Router();
const Idea = require('../models/Idea');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

// Get all ideas
router.get('/', async (req, res) => {
    try {
        const ideas = await Idea.find()
            .populate('author', 'email')
            .populate('comments.author', 'email')
            .sort({ createdAt: -1 });
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
            author: req.user.id,
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
                data: { ideaId: savedIdea._id },
            });
            await notification.save();
        }

        res.status(201).json(savedIdea);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Add a comment to an idea
router.post('/:id/comments', authenticateToken, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || !text.trim()) {
            return res.status(400).json({ message: 'Comment text is required' });
        }

        const idea = await Idea.findById(req.params.id);
        if (!idea) {
            return res.status(404).json({ message: 'Idea not found' });
        }

        idea.comments.unshift({
            author: req.user.id,
            text: text.trim(),
        });

        await idea.save();
        await idea.populate('author', 'email');
        await idea.populate('comments.author', 'email');

        res.status(201).json(idea);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Failed to add comment' });
    }
});

// Get ideas by user
router.get('/user/:userId', async (req, res) => {
    try {
        const ideas = await Idea.find({ author: req.params.userId })
            .populate('author', 'email')
            .populate('comments.author', 'email');
        res.json(ideas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
