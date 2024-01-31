import express from "express";
import pool from "../database/db.js";
import dotenv from 'dotenv';
import { errorHandler } from '../utils/error.js';
import { verifyToken } from '../utils/verifyToken.js';
import { v4 } from "uuid";
dotenv.config();

const router = express.Router();

router.post('/create-post', verifyToken, (req, res, next) => {
    
})




export default router;