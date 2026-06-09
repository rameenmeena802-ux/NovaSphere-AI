require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const connectDB = require('./config/db');

// Import routers
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const blogRoutes = require('./routes/blogRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Initialize app
const app = express();
const server = http.createServer(app);

// Connect database
connectDB();

// Initialize Socket.io
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
const io = socketIo(server, {
  cors: {
    origin: '*', // For development flexibility
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Expose Socket.io globally
global.io = io;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // Allows image access
}));
app.use(cors({
  origin: '*', // Allow all for smooth local demo setup
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve local uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Base route
app.use('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date(),
    database: global.dbConnected ? 'connected' : 'mockup-mode'
  });
});

// Fallback route handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Novasphere Endpoint Not Found' });
});

// Global error handler middleware
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.message);
  res.status(500).json({ success: false, message: 'Critical Core Matrix Error: ' + err.message });
});

// Socket.io Connection Matrix
io.on('connection', (socket) => {
  console.log(`🔌 Client synced to Matrix Node: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`🔌 Client desynced: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Novasphere AI Universe Core running on port ${PORT}`);
  console.log(`⚡ Mode: ${global.dbConnected ? 'Production DB Connected' : 'Simulated Sandbox Mode'}`);
});
