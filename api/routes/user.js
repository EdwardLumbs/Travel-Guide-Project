import express from "express";
import pool from "../database/db.js";
import dotenv from 'dotenv';
import bcryptjs from 'bcryptjs';
import { verifyToken } from '../utils/verifyToken.js';
import { errorHandler } from '../utils/error.js';
dotenv.config();

const router = express.Router();

router.post('/updateUser/:id', verifyToken, async (req, res, next) => {
    const { username, description, photo, user_iata } = req.body;

    console.log(username)
    if (req.user.id != req.params.id)
        return next(errorHandler(401, 'Not your account'));

    try {
        if (req.body.newPassword) {
            req.body.newPassword = bcryptjs.hashSync(req.body.newPassword, 10);
        }
        await pool.query("UPDATE users SET username = COALESCE($1, username), password = COALESCE($2, password), description = COALESCE($3, description), photo = COALESCE($4, photo), user_iata = COALESCE($5, user_iata) WHERE id = $6;",
        [username, req.body.newPassword, description, photo, user_iata, req.params.id]);
    
        try {
            const data = await pool.query("SELECT * FROM users WHERE id = $1",
            [req.params.id]);

            const user = data.rows[0];

            const {password: pass, ...rest} = user;

            res.status(200).json(rest);

        } catch (error) {
            next(error);
        }

    } catch (error) {
        next(error);
    }
})

router.delete('/delete/:id', verifyToken, async (req, res, next) => {
    if (req.user == req.params.id) 
        return next(errorHandler(401, 'You can only delete your own account'));

    try {
        await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
        res.clearCookie('access_token')
        res.clearCookie('refresh_token')
        res.status(200).json('User has been deleted')
    } catch (error) {
        next(error)
    }
})

router.get('/getUser/:id', async (req, res, next) => {
    const { id } = req.params
    console.log(id)
    try {
        const data = await pool.query(`SELECT username, photo
        FROM users
        WHERE id = $1`, [id])

        if (data.rows.length === 0) {
            return next(errorHandler(404, 'User not found'));
        }

        res.status(200).json(data.rows);

    } catch (error) {
        next(error);
    } 
})

export default router;