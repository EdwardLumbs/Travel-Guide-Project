import express from "express";
import dotenv from 'dotenv';
import { errorHandler } from '../utils/error.js';
dotenv.config();

const router = express.Router();

router.get('/getFlight/:query', async (req, res, next) => {
    const queryString = req.params.query

    const url = `https://api.tequila.kiwi.com/v2/search?${queryString}`
    try {
        const data = await fetch(url , {
          headers: {
            'Authorization': `Bearer ${process.env.TEQUILA_API_KEY}`,
            'Content-Type': 'application/json', 
            'apikey': process.env.TEQUILA_API_KEY
          }
        })
        const flight = await data.json()
        console.log(flight) 
        console.log(flight.status)
        if (flight.status == 'Unprocessable Entity') {   
            return next(errorHandler(404, flight.error))
        } 

        if (flight.data.length === 0) {
            return next(errorHandler(404, 'No flights found for your specifications. Try with different options'))
        }

        const flightData = flight.data[0]
        res.status(200).json(flightData)
        

    } catch (error) {
      next(error)
    }
      
})

export default router;