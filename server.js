

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';  

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

// MongoDB connection
const db_url = process.env.DB_URL;
try {
    await mongoose.connect(db_url || "mongodb://localhost:27017/socialmedia");
    console.log("MongoDB connected");
} catch (error) {
    console.error("Error connecting to DB", error.message);
    process.exit(1);
}

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || "this is secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
import studentRouter from './src/apps/users/routes.js';
import messageRouter from './src/apps/message/routes.js';
import postRouter from './src/apps/posts/routes.js';
import { chatController } from './src/apps/message/controller.js';

app.use('/api/auth', studentRouter);
app.use('/api', postRouter);
app.use('/api', messageRouter);

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
    
    // Add your custom events (like chat message)
    chatController(io, socket);  // Hook up your chat controller
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
