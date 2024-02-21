import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import pool from './database/db.js';
import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';
import destinationRouter from './routes/destination.js';
import flightsRouter from './routes/flights.js';
import attractionsRouter from './routes/attractions.js';
import newsRouter from './routes/news.js';
import blogRouter from './routes/blogs.js';
import tripsRouter from './routes/trips.js';
import cors from 'cors';
import path from 'path';

dotenv.config();

const app = express();

const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/destination", destinationRouter);
app.use("/api/flights", flightsRouter);
app.use("/api/attractions", attractionsRouter);
app.use("/api/news", newsRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/trips", tripsRouter);

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server running on port ${process.env.SERVER_PORT}`);
});

app.use(express.static(path.koin(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

// error handling middleware

app.use((err, req, res,next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error'
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode
    });
});