import express from "express";
import pool from "../database/db.js";
import dotenv from 'dotenv';
import { errorHandler } from '../utils/error.js';
import { verifyToken } from '../utils/verifyToken.js';
dotenv.config();

const router = express.Router();

router.post('/createTrip', verifyToken, async(req, res, next) => {
    const { title, destination, note } = req.body
    console.log(title)
    console.log(destination)
    console.log(note)


    try {
        await pool.query("INSERT INTO trips (title, destination, note) VALUES ($1, $2, $3)",
        [title, destination, note])
        res.status(201).json("Trip Posted Successfully");

    } catch (error) {
        next(error);
    }
})


export default router;