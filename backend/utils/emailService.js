const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send welcome email after registration
const sendWelcomeEmail = async (email, name) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to Google Club!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4285f4;">Welcome to Google Club!</h2>
                    <p>Dear ${name || 'Member'},</p>
                    <p>Thank you for joining Google Club! We're excited to have you as part of our community.</p>
                    <p>You can now:</p>
                    <ul>
                        <li>Share your innovative ideas on the Idea Wall</li>
                        <li>Participate in exciting events and workshops</li>
                        <li>Access learning resources and materials</li>
                        <li>Connect with like-minded tech enthusiasts</li>
                    </ul>
                    <p>Get started by exploring our platform and sharing your first idea!</p>
                    <br>
                    <p>Best regards,<br>The Google Club Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent to:', email);
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
};

// Send event registration confirmation email
const sendEventRegistrationEmail = async (email, eventTitle, eventDate) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Registration Confirmed: ${eventTitle}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4285f4;">Event Registration Confirmed!</h2>
                    <p>Your registration for the following event has been confirmed:</p>
                    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin: 0; color: #333;">${eventTitle}</h3>
                        <p style="margin: 10px 0 0 0; color: #666;">Date: ${new Date(eventDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}</p>
                    </div>
                    <p>Please arrive 15 minutes early. Don't forget to bring your enthusiasm!</p>
                    <p>If you have any questions, feel free to contact us.</p>
                    <br>
                    <p>Best regards,<br>The Google Club Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Event registration email sent to:', email);
    } catch (error) {
        console.error('Error sending event registration email:', error);
    }
};

// Send notification email to all users
const sendNotificationEmail = async (emails, message, type) => {
    try {
        const subject = type === 'urgent' ? '🚨 Urgent Notification from Google Club' :
                       type === 'event' ? '📅 Event Notification from Google Club' :
                       '📢 Notification from Google Club';

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: emails,
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #4285f4;">New Notification from Google Club</h2>
                    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; font-size: 16px; line-height: 1.6;">${message}</p>
                    </div>
                    <p>Check your notifications in the app for more details.</p>
                    <br>
                    <p>Best regards,<br>The Google Club Team</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Notification email sent to all users');
    } catch (error) {
        console.error('Error sending notification email:', error);
    }
};

module.exports = {
    sendWelcomeEmail,
    sendEventRegistrationEmail,
    sendNotificationEmail
};
