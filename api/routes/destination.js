import express from "express";
import pool from "../database/db.js";
import dotenv from 'dotenv';
import { errorHandler } from '../utils/error.js';
dotenv.config();

const router = express.Router();

router.get('/getCountry/:name', async (req, res, next) => {
    try {
        const data = await pool.query(`SELECT *
        FROM countries
        JOIN continents 
        ON continent_id = continents.id
        WHERE country ILIKE $1`,
        [req.params.name]);

        if (data.rows.length === 0) {
            return next(errorHandler(404, 'Country not found'));
        }
        
        const location = data.rows[0];
        res.status(200).json(location);
        
    } catch (error) {
        next(error)
    }
})

router.get('/getCountries/', async (req, res, next) => {
    try {
        const data = await pool.query(`SELECT country, continent_name, photo
        FROM countries
        JOIN continents 
        ON continent_id = continents.id`);

        if (data.rows.length === 0) {
            return next(errorHandler(404, 'Country not found'));
        }
        
        const location = data.rows;
        res.status(200).json(location);
        
    } catch (error) {
        next(error)
    }
})

router.get('/getContinent/:name', async (req, res, next) => {
    try {
        const data = await pool.query(`SELECT *
        FROM continents 
        WHERE continent_name ILIKE $1`,
        [req.params.name]);

        if (data.rows.length === 0) {
            return next(errorHandler(404, 'Continent not found'));
        }
        
        const location = data.rows[0];
        res.status(200).json(location);
        
    } catch (error) {
        next(error)
    }
})

router.get('/getContinents/', async (req, res, next) => {
    try {
        const data = await pool.query(`SELECT continent_name, continent_photo
        FROM continents`);

        if (data.rows.length === 0) {
            return next(errorHandler(404, 'Continents not found'));
        }
        
        const location = data.rows;
        res.status(200).json(location);
        
    } catch (error) {
        next(error)
    }
})

router.get('/getContinentCountry/:name', async (req, res, next) => {
    try {
        const data = await pool.query(`SELECT countries.id, photo, country
        FROM countries
        JOIN continents 
        ON continent_id = continents.id
        WHERE continent_name ILIKE $1`,
        [req.params.name]);

        if (data.rows.length === 0) {
            return next(errorHandler(404, 'Countries not found'));
        }
        
        const location = data.rows;
        res.status(200).json(location);
        
    } catch (error) {
        next(error)
    }
})

router.get('/filterCountries', async (req, res, next) => {
    const {type, sort} = req.query;

    try {
        let sqlQuery
        if (type.toLowerCase() === 'country') {
            sqlQuery = "SELECT country, continent_name, photo FROM countries JOIN continents  ON continent_id = continents.id ORDER BY country"
        } else if (type.toLowerCase() === 'continent') {
            sqlQuery = "SELECT continent_name, continent_photo FROM continents ORDER BY continent_name "
        } else {
            return next(errorHandler(400, 'Invalid type parameter'))
        }

        if (sort.toLowerCase() === 'desc') {
            sqlQuery = sqlQuery + ' DESC'
        } else if(sort.toLowerCase() !== 'asc') {
            return next(errorHandler(400, 'Invalid type parameter'))
        }

        const data = await pool.query(sqlQuery)
        if (data.rows.length === 0) {
            return next(errorHandler(404, `${type} not found`));
        }

        const location = data.rows;
        res.status(200).json(location);
    } catch (error) {
        next(error)
    }
})

export default router;