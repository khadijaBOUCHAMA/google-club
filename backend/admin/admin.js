const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Event = require('../models/Event');
const Notification = require('../models/Notification');
const Resource = require('../models/Resource');

// Admin Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized: Not an admin' });
        }

        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, 'supersecretkey', { expiresIn: '1h' });
        res.json({ message: 'Login successful', token, role: user.role });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Middleware to protect admin routes
const authenticateAdmin = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, 'supersecretkey', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized: Not an admin' });
        }
        req.user = decoded;
        next();
    });
};

// Admin-only routes
router.get('/dashboard', authenticateAdmin, (req, res) => {
    res.json({ message: `Welcome to the admin dashboard, ${req.user.email}!` });
});

// ==================== EVENTS ====================
// Get all events
router.get('/events', authenticateAdmin, async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });
        res.json({ events });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add Event
router.post('/events', authenticateAdmin, async (req, res) => {
    const { title, description, date } = req.body;
    
    if (!title || !description || !date) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const event = new Event({ title, description, date });
        await event.save();
        console.log('New Event Added:', event);
        res.status(201).json({ message: 'Event added successfully', event });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Event
router.put('/events/:id', authenticateAdmin, async (req, res) => {
    const { id } = req.params;
    const { title, description, date } = req.body;
    
    if (!title || !description || !date) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const event = await Event.findByIdAndUpdate(id, { title, description, date }, { new: true });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        console.log(`Event ${id} Modified:`, event);
        res.json({ message: 'Event updated successfully', event });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Event
router.delete('/events/:id', authenticateAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const event = await Event.findByIdAndDelete(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        console.log(`Event ${id} Deleted:`, event);
        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ==================== NOTIFICATIONS ====================
// Get all notifications
router.get('/notifications', authenticateAdmin, async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ createdAt: -1 });
        res.json({ notifications });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add Notification
router.post('/notifications', authenticateAdmin, async (req, res) => {
    const { message, type } = req.body;
    
    if (!message || !type) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const notification = new Notification({ message, type });
        await notification.save();
        console.log('New Notification Added:', notification);
        res.status(201).json({ message: 'Notification added successfully', notification });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Notification
router.put('/notifications/:id', authenticateAdmin, async (req, res) => {
    const { id } = req.params;
    const { message, type } = req.body;
    
    if (!message || !type) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const notification = await Notification.findByIdAndUpdate(id, { message, type }, { new: true });
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        console.log(`Notification ${id} Modified:`, notification);
        res.json({ message: 'Notification updated successfully', notification });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Notification
router.delete('/notifications/:id', authenticateAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const notification = await Notification.findByIdAndDelete(id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        console.log(`Notification ${id} Deleted:`, notification);
        res.json({ message: 'Notification deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// ==================== RESOURCES ====================
// Get all resources
router.get('/resources', authenticateAdmin, async (req, res) => {
    try {
        const resources = await Resource.find().sort({ createdAt: -1 });
        res.json({ resources });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add Resource
router.post('/resources', authenticateAdmin, async (req, res) => {
    const { name, url, category } = req.body;
    
    if (!name || !url || !category) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const resource = new Resource({ name, url, category });
        await resource.save();
        console.log('New Resource Added:', resource);
        res.status(201).json({ message: 'Resource added successfully', resource });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Resource
router.put('/resources/:id', authenticateAdmin, async (req, res) => {
    const { id } = req.params;
    const { name, url, category } = req.body;
    
    if (!name || !url || !category) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const resource = await Resource.findByIdAndUpdate(id, { name, url, category }, { new: true });
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        console.log(`Resource ${id} Modified:`, resource);
        res.json({ message: 'Resource updated successfully', resource });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Resource
router.delete('/resources/:id', authenticateAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const resource = await Resource.findByIdAndDelete(id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        console.log(`Resource ${id} Deleted:`, resource);
        res.json({ message: 'Resource deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;