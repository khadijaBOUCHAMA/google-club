require('dotenv').config();
const mongoose = require('mongoose');
const Idea = require('../models/Idea');
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/google_club';

const sampleUserEmail = 'demo.user@example.com';
const sampleUserPassword = 'DemoPass123';

const ideas = [
  {
    title: 'AI-Powered Study Buddy',
    description:
      'A chat-based assistant that helps students summarize lectures, generate quizzes, and schedule study sessions based on their course load.',
    tags: ['AI', 'Education', 'Productivity'],
  },
  {
    title: 'Campus Event Matcher',
    description:
      'A recommendation engine that suggests campus events to students based on their interests, previous attendance, and availability.',
    tags: ['Machine Learning', 'Events', 'Recommendation'],
  },
  {
    title: 'Green Commute Tracker',
    description:
      'A mobile app that tracks eco-friendly commutes (bike, walk, carpool) and rewards students with points redeemable at local cafes.',
    tags: ['Sustainability', 'Mobile', 'Gamification'],
  },
];

async function seedIdeas() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    let user = await User.findOne({ email: sampleUserEmail });
    if (!user) {
      user = new User({
        email: sampleUserEmail,
        password: sampleUserPassword,
        role: 'user',
      });
      await user.save();
      console.log(`Created sample user: ${sampleUserEmail}`);
    } else {
      console.log(`Using existing user: ${sampleUserEmail}`);
    }

    const ideasWithUser = ideas.map((idea) => ({
      ...idea,
      author: user._id,
    }));

    await Idea.deleteMany({ title: { $in: ideas.map((idea) => idea.title) } });
    await Idea.insertMany(ideasWithUser);

    console.log('Inserted sample ideas successfully');
  } catch (error) {
    console.error('Failed to seed ideas:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedIdeas();