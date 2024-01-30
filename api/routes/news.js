import express from "express";
import dotenv from 'dotenv';
import { errorHandler } from '../utils/error.js';
dotenv.config();

const router = express.Router();

router.get('/getNews/:place', async (req, res, next) => {
    const apiKey = process.env.NEWS_API_KEY
    console.log(apiKey)
    const keyword = `${req.params.place} tourism`
    const url = `https://newsapi.org/v2/everything?q=${keyword}&pageSize=4`
 
    try {
        const data = await fetch(url, {
            headers: {
                'Authorization': apiKey,
                'Content-Type': 'application/json', 
            }
        })
        const news = await data.json()
        console.log(news.articles)
        if (news?.articles.length === 0) {
            return next(errorHandler(404, 'No relevant news found'))
        }

        res.status(200).json(news.articles)
        
    } catch (error) {
        next(error)
    }

})

export default router;