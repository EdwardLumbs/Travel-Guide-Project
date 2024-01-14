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

    try {
        await pool.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3)",
            [username, email, hashedPassword]);
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

export default router;