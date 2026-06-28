require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const { errorHandler } = require('./middleware/errorHandler');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

const app = express();

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowedOrigins = ["https://reuseme-eight.vercel.app"];
    const isLocalhost = /^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin);
    if (isLocalhost || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static public assets if any
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Wildcard 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// Fallback to static views if any (optional, e.g. for simple HTML/CSS tests)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/reuseme';

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB database successfully.');

    // Run migration to fix user documents with invalid geo-keys
    try {
      const User = require('./models/User');
      const result = await User.updateMany(
        { 
          $or: [
            { "location.coordinates": { $exists: false } },
            { "location.coordinates": null },
            { "location.coordinates": { $size: 0 } }
          ]
        },
        { 
          $set: { 
            location: { 
              type: "Point", 
              coordinates: [0, 0] 
            } 
          } 
        }
      );
      if (result.modifiedCount > 0) {
        console.log(`Migration: Fixed ${result.modifiedCount} user documents with invalid geo location.`);
      }
    } catch (migrationErr) {
      console.warn('Migration failed or skipped:', migrationErr.message);
    }

    app.listen(PORT, () => {
      console.log(`Express API Server running on port ${PORT}`);
      console.log(`Server URL: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err);
  });