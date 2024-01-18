import express from "express";
import pool from "../database/db.js";
import dotenv from 'dotenv';
import { errorHandler } from '../utils/error.js';
dotenv.config();

const router = express.Router();

router.post('/getLocation/:name', async (req, res, next) => {
    const {selector} = req.body;

    try {
        const data = await pool.query(`SELECT * FROM countries WHERE ${selector} ILIKE $1`,
        [req.params.name]);

        if (!data) {
            return next(errorHandler(404, 'Listing not found'));
        }
        
        const location = data.rows[0];
        res.status(200).json(location);
    } catch (error) {
        next(error)
    }
})

export default router;