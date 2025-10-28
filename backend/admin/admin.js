const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Import User model

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

// Admin-only routes (example)
router.get('/dashboard', authenticateAdmin, (req, res) => {
    res.json({ message: `Welcome to the admin dashboard, ${req.user.email}!` });
});

// Add Event
router.post('/events', authenticateAdmin, (req, res) => {
    const { title, description, date } = req.body;
    // In a real app, save to database
    console.log('New Event Added:', { title, description, date });
    res.status(201).json({ message: 'Event added successfully', event: { title, description, date } });
});

// Modify Event
router.put('/events/:id', authenticateAdmin, (req, res) => {
    const { id } = req.params;
    const { title, description, date } = req.body;
    // In a real app, update in database
    console.log(`Event ${id} Modified:`, { title, description, date });
    res.json({ message: `Event ${id} updated successfully`, event: { id, title, description, date } });
});

// Add Notification
router.post('/notifications', authenticateAdmin, (req, res) => {
    const { message, type } = req.body;
    // In a real app, save to database
    console.log('New Notification Added:', { message, type });
    res.status(201).json({ message: 'Notification added successfully', notification: { message, type } });
});

// Modify Notification
router.put('/notifications/:id', authenticateAdmin, (req, res) => {
    const { id } = req.params;
    const { message, type } = req.body;
    // In a real app, update in database
    console.log(`Notification ${id} Modified:`, { message, type });
    res.json({ message: `Notification ${id} updated successfully`, notification: { id, message, type } });
});

// Add Resource
router.post('/resources', authenticateAdmin, (req, res) => {
    const { name, url, category } = req.body;
    // In a real app, save to database
    console.log('New Resource Added:', { name, url, category });
    res.status(201).json({ message: 'Resource added successfully', resource: { name, url, category } });
});

// Modify Resource
router.put('/resources/:id', authenticateAdmin, (req, res) => {
    const { id } = req.params;
    const { name, url, category } = req.body;
    // In a real app, update in database
    console.log(`Resource ${id} Modified:`, { name, url, category });
    res.json({ message: `Resource ${id} updated successfully`, resource: { id, name, url, category } });
});


module.exports = router;
