import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import pool from './database/db.js';
import authRouter from './routes/auth.js';
import userRouter from './routes/user.js';
import destinationRouter from './routes/destination.js';
import flightsRouter from './routes/flights.js'
import attractionsRouter from './routes/attractions.js'
import newsRouter from './routes/news.js'
import blogRouter from './routes/blogs.js'
import cors from 'cors'

dotenv.config();

const app = express();

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

app.get('/test', async (req, res) => {
    try {
        const results = await pool.query("SELECT * FROM users WHERE email = $1",
        ["edwardlumbao@yahoo.com"])
        res.json(results.rows)
    } catch (error) {
        console.log(error)
    }
})

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server running on port ${process.env.SERVER_PORT}`);
})

// error handling middleware

app.use((err, req, res,next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error'
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode
    })
})