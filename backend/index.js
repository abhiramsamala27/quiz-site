const path = require('path');
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const adminRoutes = require('./routes/admin');
const quizRoutes = require('./routes/quiz');
const keepAlive = require('./utils/keepAlive');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/quiz', quizRoutes);

// Ping endpoint for UptimeRobot
app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// Health Check
app.get('/', (req, res) => {
  res.send('Quiz App API is running...');
});

// Database Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/quizapp';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err.message));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  
  // Keep alive logic for Render/Railway
  const BACKEND_URL = process.env.BACKEND_URL;
  if (BACKEND_URL) {
    keepAlive(BACKEND_URL);
  }
});
