import express from "express";
import pool from "../database/db.js";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
dotenv.config()

const router = express.Router()

router.post('/signup', async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const defaultPhoto = 'https://t4.ftcdn.net/jpg/00/64/67/27/360_F_64672736_U5kpdGs9keUll8CRQ3p3YaEv2M6qkVY5.jpg';

    try {
        await pool.query("INSERT INTO users (username, email, password, photo) VALUES ($1, $2, $3, $4)",
            [username, email, hashedPassword, defaultPhoto]);
        res.status(201).json("User Created Successfully");

    } catch (error) {
        next(error);
    }
})

router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    
    try {
        const data = await pool.query("SELECT * FROM users WHERE email = $1",
            [email]);

        const user = data.rows[0]

        if (!user) {
            return next(errorHandler(404, "User not Found"));
        }

        const validPassword = bcryptjs.compareSync(password, user.password);
        if (!validPassword) {
            return next(errorHandler(401, "Wrong credentials"));
        }

        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jwt.sign({id: user.id}, process.env.JWT_REFRESH_SECRET, { expiresIn: '1d' });

        const {password: pass, ...rest} = user;

        res
            .cookie('access_token', token, {maxAge: 3600000, httpOnly: true, sameSite: 'strict' })
            .cookie('refresh_token', refreshToken, {httpOnly: true, sameSite: 'strict' })
            .status(200)
            .json(rest)

    } catch (error) {
        next(error);
    }
})

router.post('/google', async (req, res, next) => {
    const { username, email, photo } = req.body;

    try {
        const data = await pool.query("SELECT * FROM users WHERE email = $1",
        [email]);

        const user = data.rows[0];

        if (!user) {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
        
            try {
                await pool.query("INSERT INTO users (username, email, password, photo) VALUES ($1, $2, $3, $4)",
                    [username, email, hashedPassword, photo]);
            } catch (error) {
                next(error);
            }

            const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, { expiresIn: '1h' });
            const refreshToken = jwt.sign({id: user.id}, process.env.JWT_REFRESH_SECRET, { expiresIn: '1d' });

            const {password: pass, ...rest} = user;

            res
                .cookie('access_token', token, {maxAge: 3600000, httpOnly: true, sameSite: 'strict' })
                .cookie('refresh_token', refreshToken, {httpOnly: true, sameSite: 'strict' })
                .status(200)
                .json(rest)

        } else {
            const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, { expiresIn: '1h' });
            const refreshToken = jwt.sign({id: user.id}, process.env.JWT_REFRESH_SECRET, { expiresIn: '1d' });

            const {password: pass, ...rest} = user;

            res
                .cookie('access_token', token, {maxAge: 3600000, httpOnly: true, sameSite: 'strict' })
                .cookie('refresh_token', refreshToken, {httpOnly: true, sameSite: 'strict' })
                .status(200)
                .json(rest)
        }

    } catch (error) {
        next(error);
    }
})

export default router;