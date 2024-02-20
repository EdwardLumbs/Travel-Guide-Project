import express from "express";
import pool from "../database/db.js";
import dotenv from 'dotenv';
import { errorHandler } from '../utils/error.js';
import { verifyToken } from '../utils/verifyToken.js';
dotenv.config();

const router = express.Router();

router.post('/createTrip', verifyToken, async(req, res, next) => {
    const { title, destination, note, user_id } = req.body;

    try {
        await pool.query("INSERT INTO trips (title, user_id, destination, note) VALUES ($1, $2, $3, $4)",
        [title, user_id, destination, note]);

        const result = await pool.query(
            "SELECT * FROM trips WHERE title = $1 AND user_id = $2 AND destination = $3 AND note = $4",
            [title, user_id, destination, note]
        );

        if (result.rows.length === 0) {
            return next(errorHandler(408, 'Something went wrong'));
        };

        const trip = result.rows[0]

        res.status(201).json(trip);

    } catch (error) {
        next(error);
    };
});

router.delete('/deleteTrip/:tripId', verifyToken, async (req, res, next) => {
    const { tripId } = req.params;
    console.log(tripId);
    try {
        await pool.query(`DELETE FROM trips
        WHERE id = $1`,
        [tripId]);

        res.status(200).json('Successfully deleted');

    } catch (error) {
        next(error);
    };
});

router.get('/getUserTrips/:userId', verifyToken, async (req, res, next) => {
    const { userId } = req.params;
    try {
        const data = await pool.query(`SELECT * FROM trips
            WHERE user_id = $1`,
            [userId]);

        if (data.rows.length === 0) {
            return next(errorHandler(404, 'No trips found'));
        };

        res.status(200).json(data.rows);

    } catch (error) {
        next(error);
    };
});

router.get('/getTrip/:tripId', verifyToken, async (req, res, next) => {
    const { tripId } = req.params;
    console.log(tripId);
    try {
        const data = await pool.query(`SELECT * FROM trips
        WHERE id = $1`,
        [tripId]);

        if (data.rows.length === 0) {
            return next(errorHandler(404, 'Trip not found'));
        };

        res.status(200).json(data.rows);

    } catch (error) {
        next(error);
    };
});

export default router;