import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import pool from './database/db.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/test', async (req, res) => {
    try {
        const results = await pool.query("SELECT * FROM users")
        res.json(results.rows)
    } catch (error) {
        console.log(error)
    }
})

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server running on port ${process.env.SERVER_PORT}`);
})