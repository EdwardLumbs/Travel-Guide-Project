import express from "express";
import dotenv from 'dotenv';
import { errorHandler } from '../utils/error.js';
dotenv.config();

const router = express.Router();

router.get('/getNews/:country', async (req, res, next) => {
    const apiKey = process.env.NEWS_API_KEY
    const keyword = `${req.params.country} tourism`
    const url = `https://newsapi.org/v2/everything?q=${keyword}&pageSize=4`
 
    try {
        const data = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${process.env.TEQUILA_API_KEY}`,
                'Content-Type': 'application/json', 
            }
        })
        const news = await data.json()
        console.log(news)
        
    } catch (error) {
        next(error)
    }

})

export default router;