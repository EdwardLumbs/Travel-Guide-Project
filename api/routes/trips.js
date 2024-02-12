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

router.delete('/deleteTrip/:tripId', verifyToken, async (req, res, next) => {
    const { tripId } = req.params
    console.log(tripId)
    try {
        await pool.query(`DELETE FROM trips
        WHERE id = $1`,
        [tripId])

        res.status(200).json('Successfully deleted');

    } catch (error) {
        next(error);
    }
})

router.get('/getUserTrips/:userId', verifyToken, async (req, res, next) => {
    const { userId } = req.params
    try {
        const data = await pool.query(`SELECT * FROM trips
            WHERE user_id = $1`,
            [userId])

        if (data.rows.length === 0) {
            return next(errorHandler(404, 'No trips found'));
        }

        res.status(200).json(data.rows);

    } catch (error) {
        next(error);
    }
})

router.get('/getTrip/:tripId', verifyToken, async (req, res, next) => {
    const { tripId } = req.params
    console.log(tripId)
    try {
        const data = await pool.query(`SELECT * FROM trips
        WHERE id = $1`,
        [tripId])

        if (data.rows.length === 0) {
            return next(errorHandler(404, 'Trip not found'));
        }

        res.status(200).json(data.rows);

    } catch (error) {
        next(error);
    }
})

export default router;