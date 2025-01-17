import express from 'express';
import connectDB from './db/index.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
