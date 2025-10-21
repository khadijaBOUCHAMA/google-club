const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Event = require('../models/Event');
const Notification = require('../models/Notification');
const Resource = require('../models/Resource');
const { sendNotificationEmail } = require('../utils/emailService');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads');
        // Ensure directory exists
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Allow common file types
        const allowedTypes = /pdf|doc|docx|txt|jpg|jpeg|png|gif|mp4|avi|mov|zip|rar/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});

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
        // Create notification for each user
        const users = await User.find();
        const notifications = [];

        for (const user of users) {
            const notification = new Notification({
                user: user._id,
                title: 'Admin Notification',
                message,
                type: type || 'admin'
            });
            await notification.save();
            notifications.push(notification);
        }

        // Send email to all users
        const emails = users.map(user => user.email);
        await sendNotificationEmail(emails, message, type);

        console.log('New Notification Added for all users:', notifications.length);
        res.status(201).json({ message: 'Notifications sent to all users', count: notifications.length });
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
        const resources = await Resource.find().populate('uploadedBy', 'email').sort({ createdAt: -1 });
        res.json({ resources });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add Resource (URL or File)
router.post('/resources', authenticateAdmin, upload.single('file'), async (req, res) => {
    const { name, url, category } = req.body;

    if (!name || !category) {
        return res.status(400).json({ message: 'Name and category are required' });
    }

    if (!url && !req.file) {
        return res.status(400).json({ message: 'Either URL or file must be provided' });
    }

    try {
        const resourceData = {
            name,
            category,
            uploadedBy: req.user.id
        };

        if (url) {
            resourceData.url = url;
        }

        if (req.file) {
            resourceData.filePath = req.file.path;
            resourceData.fileName = req.file.originalname;
            resourceData.fileSize = req.file.size;
            resourceData.mimeType = req.file.mimetype;
        }

        const resource = new Resource(resourceData);
        await resource.save();

        console.log('New Resource Added:', resource);
        res.status(201).json({ message: 'Resource added successfully', resource });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Resource
router.put('/resources/:id', authenticateAdmin, upload.single('file'), async (req, res) => {
    const { id } = req.params;
    const { name, url, category } = req.body;

    if (!name || !category) {
        return res.status(400).json({ message: 'Name and category are required' });
    }

    try {
        const resource = await Resource.findById(id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        const updateData = { name, category };

        if (url) {
            updateData.url = url;
            // Remove file data if URL is provided
            updateData.filePath = null;
            updateData.fileName = null;
            updateData.fileSize = null;
            updateData.mimeType = null;
        }

        if (req.file) {
            // Delete old file if exists
            if (resource.filePath && fs.existsSync(resource.filePath)) {
                fs.unlinkSync(resource.filePath);
            }

            updateData.filePath = req.file.path;
            updateData.fileName = req.file.originalname;
            updateData.fileSize = req.file.size;
            updateData.mimeType = req.file.mimetype;
            updateData.url = null; // Remove URL if file is uploaded
        }

        const updatedResource = await Resource.findByIdAndUpdate(id, updateData, { new: true });
        console.log(`Resource ${id} Modified:`, updatedResource);
        res.json({ message: 'Resource updated successfully', resource: updatedResource });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Resource
router.delete('/resources/:id', authenticateAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const resource = await Resource.findById(id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        // Delete file if exists
        if (resource.filePath && fs.existsSync(resource.filePath)) {
            fs.unlinkSync(resource.filePath);
        }

        await Resource.findByIdAndDelete(id);
        console.log(`Resource ${id} Deleted:`, resource);
        res.json({ message: 'Resource deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Download Resource File
router.get('/resources/:id/download', authenticateAdmin, async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource || !resource.filePath) {
            return res.status(404).json({ message: 'File not found' });
        }

        if (!fs.existsSync(resource.filePath)) {
            return res.status(404).json({ message: 'File not found on server' });
        }

        res.download(resource.filePath, resource.fileName);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
