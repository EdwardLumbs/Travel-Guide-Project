import express from "express";
import pool from "../database/db.js";
import dotenv from 'dotenv';
import { errorHandler } from '../utils/error.js';
import { verifyToken } from '../utils/verifyToken.js';
dotenv.config();

const router = express.Router();

router.post('/createTrip', verifyToken, async(req, res, next) => {
    const { title, destination, note, user_id } = req.body
    console.log(title)
    console.log(destination)
    console.log(note)

    try {
        await pool.query("INSERT INTO trips (title, user_id, destination, note) VALUES ($1, $2, $3, $4)",
        [title, user_id, destination, note])
        res.status(201).json("Trip Posted Successfully");

    } catch (error) {
        next(error);
    }
})

router.get('/getTrip/:TripId', verifyToken, async (req, res, next) => {
    const { TripId } = req.params
    try {
        const data = await pool.query("SELECT * FROM blogs WHERE id = $1",
        [TripId])

        if (data.rows.length === 0) {
            return next(errorHandler(404, 'Trip not found'));
        }

        res.status(200).json(data.rows);

    } catch (error) {
        next(error);
    }
})

export default router;