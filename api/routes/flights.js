import express from "express";
import dotenv from 'dotenv';
import pool from "../database/db.js";
import { errorHandler } from '../utils/error.js';
dotenv.config();

const router = express.Router();

router.get('/getFlight/:query/:flyFrom/:flyTo', async (req, res, next) => {
    const queryString = req.params.query;
    const flyFromUrl = req.params.flyFrom;
    const flyToUrl = req.params.flyTo;

    if (flyFromUrl.length > 3 || flyToUrl.length > 3) {
      return next(errorHandler(406, 'Invalid IATA Code'));
    } 

    const url = `https://api.tequila.kiwi.com/v2/search?${queryString}`
    try {
        const data = await fetch(url , {
          headers: {
            'Authorization': `Bearer ${process.env.TEQUILA_API_KEY}`,
            'Content-Type': 'application/json', 
            'apikey': process.env.TEQUILA_API_KEY
          }
        });
        const flight = await data.json()

        if (flight.status == 'Unprocessable Entity') {   
            return next(errorHandler(404, flight.error));
        };

        if (flight.data.length === 0) {
            return next(errorHandler(404, 'No flights found for your specifications. Try with different options'))
        };

        const flightData = flight.data[0];
        res.status(200).json(flightData);
        

    } catch (error) {
      next(error);
    } 
})

router.get('/getIata', async (req, res, next) => {
  try {
    const data = await pool.query(`SELECT country_iata, country 
    FROM countries`);

    if (data.rows.length === 0) {
      return next(errorHandler(404, 'Country not found'));
    }

    const iataCodes = data.rows;
    res.status(200).json(iataCodes);
  } catch (error) {
    next(error);
  }
})

export default router;