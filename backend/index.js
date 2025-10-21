const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose'); // Import mongoose
const adminRoutes = require('./admin/admin'); // Import admin routes
const authRoutes = require('./routes/auth'); // Import auth routes
const ideaRoutes = require('./routes/ideas'); // Import idea routes
const contactRoutes = require('./routes/contact'); // Import contact routes

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = "mongodb+srv://khadijabouchama2_db_user:lPYRYgX7RraHQIIv@cluster0.kvun3el.mongodb.net/Google_Club?retryWrites=true&w=majority"

// Connect to MongoDB Atlas
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Could not connect to MongoDB Atlas...', err));

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('backend/uploads')); // Serve uploaded files

// Use auth routes
app.use('/api/auth', authRoutes);
// Use admin routes
app.use('/api/admin', adminRoutes);
// Use idea routes
app.use('/api/ideas', ideaRoutes);
// Use contact routes
app.use('/api/contact', contactRoutes);

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
