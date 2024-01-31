import express from "express";
import pool from "../database/db.js";
import dotenv from 'dotenv';
import { errorHandler } from '../utils/error.js';
import { verifyToken } from '../utils/verifyToken.js';
import { v4 } from "uuid";
dotenv.config();

const router = express.Router();

router.post('/create-post', verifyToken, async (req, res, next) => {
    const { user_id, title, place_tag, photo, content } = req.body

    try {
        await pool.query("INSERT INTO blogs (user_id, title, place_tag, photo, content) VALUES ($1, $2, $3, $4, $5)",
            [user_id, title, place_tag, photo, content])
            res.status(201).json("Blog Posted Successfully");

    } catch (error) {
        next(error);
    }
})




export default router;