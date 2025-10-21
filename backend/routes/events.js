const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { sendEventRegistrationEmail } = require('../utils/emailService');

// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new event (Admin only)
router.post('/', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { title, description, date } = req.body;

    try {
        const event = new Event({
            title,
            description,
            date
        });

        const savedEvent = await event.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Register for an event
router.post('/:id/register', authenticateToken, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Send confirmation email
        await sendEventRegistrationEmail(req.user.email, event.title, event.date);

        // Create notification for event registration
        const Notification = require('../models/Notification');
        const notification = new Notification({
            user: req.user.id,
            type: 'event',
            title: 'Event Registration Confirmed',
            message: `You have successfully registered for "${event.title}"`,
            data: { eventId: event._id }
        });
        await notification.save();

        res.json({ message: 'Registration successful. Confirmation email sent.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update an event (Admin only)
router.put('/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete an event (Admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
