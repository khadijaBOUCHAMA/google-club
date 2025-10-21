const express = require('express');
const router = express.Router();
const { sendContactEmail } = require('../utils/emailService');

// Send contact form message to admin
router.post('/', async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        // Send email to admin
        await sendContactEmail(name, email, subject, message);

        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending contact email:', error);
        res.status(500).json({ message: 'Failed to send message' });
    }
});

module.exports = router;
