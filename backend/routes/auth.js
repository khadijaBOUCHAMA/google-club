const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendWelcomeEmail } = require('../utils/emailService');

// Register User
router.post('/register', async (req, res) => {
    const { email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        user = new User({
            email,
            password,
            role: role || 'user' // Default to 'user' if not specified
        });

        await user.save();

        // Send welcome email
        await sendWelcomeEmail(user.email, user.email.split('@')[0]);

        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, 'supersecretkey', { expiresIn: '1h' });
        res.status(201).json({ message: 'User registered successfully', token, role: user.role });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login User
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

        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, 'supersecretkey', { expiresIn: '1h' });
        res.json({ message: 'Login successful', token, role: user.role });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
