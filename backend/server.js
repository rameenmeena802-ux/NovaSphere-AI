import express from 'express';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import mockStore from './config/mockDb.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== MONGODB CONNECTION =====
const isDbConnected = await connectDB();

// ===== MOCK DATA =====
const posts = mockStore.blogs.map((blog, index) => ({
  id: index + 1,
  title: blog.title,
  content: blog.content.substring(0, 200) + '...',
  author: blog.author,
  coverImage: blog.coverImage,
  tags: blog.tags,
  readTime: blog.readTime,
  createdAt: blog.createdAt
}));

// ===== APP SETUP =====
const app = express();
const server = http.createServer(app);

// ===== SOCKET.IO =====
const io = new SocketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

global.io = io;

// ===== MIDDLEWARE =====
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== ROUTES =====

// GET all posts
app.get('/api/posts', (req, res) => {
  res.json(posts);
});

// GET single post
app.get('/api/posts/:id', (req, res) => {
  const post = posts.find(p => p.id == req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.json(post);
});

// GET all projects
app.get('/api/projects', (req, res) => {
  res.json(mockStore.projects);
});

// GET all blogs
app.get('/api/blogs', (req, res) => {
  res.json(mockStore.blogs);
});

// GET all users (mock)
app.get('/api/users', (req, res) => {
  const safeUsers = mockStore.users.map(({ _id, name, email, role, avatar, createdAt }) => ({
    _id, name, email, role, avatar, createdAt
  }));
  res.json(safeUsers);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date(),
    database: isDbConnected ? 'connected' : 'mockup-mode',
    posts: posts.length,
    projects: mockStore.projects.length,
    users: mockStore.users.length
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Novasphere Endpoint Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.message);
  res.status(500).json({ success: false, message: err.message });
});

// ===== SOCKET CONNECTION =====
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5002;

server.listen(PORT, () => {
  console.log(`🚀 NovaSphere running on port ${PORT}`);
  console.log(`📊 Mock data loaded: ${posts.length} posts, ${mockStore.projects.length} projects`);
});