const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Import routes
const userRoutes = require('./routes/userRoutes');
const studentRoutes = require('./routes/studentRoutes');
const profileRoutes = require('./routes/profileRoutes');

dotenv.config();
const app = express();

// ✅ CORS setup — allow Netlify frontend
const allowedOrigins = [
  'https://surajprintingpressnew.netlify.app',
  'http://localhost:5173'
];
app.use(cors({ origin: allowedOrigins, credentials: true }));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.log('MongoDB connection error:', err));

// ✅ API Routes
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/profile', profileRoutes);

// ✅ Add this route to avoid 502 from Render
app.get('/', (req, res) => {
  res.send('Student Management Backend is live!');
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
