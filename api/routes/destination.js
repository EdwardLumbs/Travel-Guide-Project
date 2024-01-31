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

router.get('/getCountryNames', async (req, res, next) => {
    try {
        const data = await pool.query(`SELECT country FROM countries`)

        if (data.rows.length === 0) {
            return next(errorHandler(404, 'Countries not found'));
        }
        
        const countryNames = data.rows;
        res.status(200).json(countryNames);
        
    } catch (error) {
        next(error)
    }
})

router.get('/getCountries', async (req, res, next) => {
    let { page, pageSize } = req.query;
    page = parseInt(page) || 1;
    pageSize = parseInt(pageSize) || 8;
    const offset = (page - 1) * pageSize;

    try {
        const countData = await pool.query(`SELECT COUNT(*) FROM countries`)
        const totalItems = countData.rows[0].count

        const data = await pool.query(`SELECT country, continent_name, photo
        FROM countries
        JOIN continents 
        ON continent_id = continents.id
        ORDER BY country
        LIMIT $1
        OFFSET $2`, [pageSize, offset]);

        if (data.rows.length === 0) {
            return next(errorHandler(404, 'Country not found'));
        }
        
        const location = data.rows;
        res.status(200).json({location, totalItems});
        
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

router.get('/searchDestination/:destination', async (req, res, next) => {
    const { destination } = req.params

    try {
        let data = await pool.query(`SELECT country, continent_name, photo
        FROM countries
        JOIN continents
        ON continent_id = continents.id
        WHERE country ILIKE $1`, [`%${destination}%`])

        if (data.rows.length === 0) {
            const continentData = await pool.query(`SELECT continent_name, continent_photo
            FROM continents
            WHERE continent_name ILIKE $1`, [`%${destination}%`])
            if (continentData.rows.length === 0) {
                return next(errorHandler(404, `No destinations found for ${destination}`));
            } 

            data = continentData
        }

        const location = data.rows;
        res.status(200).json(location);

    } catch (error) {
        next(error)
    }
})

router.get('/getContinentCountry', async (req, res, next) => {
    let { continent, sort, page, pageSize } = req.query

    page = parseInt(page) || 1;
    pageSize = parseInt(pageSize) || 8;
    const offset = (page - 1) * pageSize;

    let sqlQuery
    let totalItems

    // for destination page
    if (sort) {
        const countData = await pool.query(`SELECT COUNT(*)
        FROM countries
        JOIN continents 
        ON continent_id = continents.id
        WHERE continent_name ILIKE $1`, [continent]);
        totalItems = countData.rows[0].count;
    
        if (sort.toLowerCase() === 'desc' || sort.toLowerCase() === 'asc') {
            sqlQuery = `SELECT countries.id, country, continent_name, photo
            FROM countries
            JOIN continents 
            ON continent_id = continents.id
            WHERE continent_name ILIKE $1
            ORDER BY country ${sort}
            LIMIT ${pageSize}
            OFFSET ${offset}`
        } else {
            return next(errorHandler(400, 'Invalid type parameter'));
        }
    // for continent page
    } else {
        sqlQuery = `SELECT countries.id, country, continent_name, photo
        FROM countries
        JOIN continents 
        ON continent_id = continents.id
        WHERE continent_name ILIKE $1
        LIMIT 4`
    }

    try {
        const data = await pool.query(sqlQuery, [continent]);
        if (data.rows.length === 0) {
            return next(errorHandler(404, 'Countries not found'));
        }
        
        const location = data.rows;
        res.status(200).json({location, totalItems});
        
    } catch (error) {
        next(error)
    }
})

router.get('/filterCountries', async (req, res, next) => {
    let {type, sort, page, pageSize} = req.query;

    page = parseInt(page) || 1;
    pageSize = parseInt(pageSize) || 8;
    const offset = (page - 1) * pageSize;

    try {
        let totalItems

        let sqlQuery
        if (type.toLowerCase() === 'country') {
            const countData = await pool.query(`SELECT COUNT(*) FROM countries`);
            totalItems = countData.rows[0].count;
            sqlQuery = `SELECT country, continent_name, photo 
                        FROM countries 
                        JOIN continents  
                        ON continent_id = continents.id 
                        ORDER BY country ${sort.toLowerCase() === 'desc' ? 'DESC' : 'ASC'}
                        LIMIT ${pageSize}
                        OFFSET ${offset}`;
        } else if (type.toLowerCase() === 'continent') {
            const countData = await pool.query(`SELECT COUNT(*) FROM continents`);
            totalItems = countData.rows[0].count;
            sqlQuery = `SELECT continent_name, continent_photo 
                        FROM continents 
                        ORDER BY continent_name ${sort.toLowerCase() === 'desc' ? 'DESC' : 'ASC'}`;
        } else {
            return next(errorHandler(400, 'Invalid type parameter'));
        }

        if (sort.toLowerCase() !== 'asc' && sort.toLowerCase() !== 'desc') {
            return next(errorHandler(400, 'Invalid sort parameter. Use "asc" or "desc".'));
        }

        const data = await pool.query(sqlQuery);
        if (data.rows.length === 0) {
            return next(errorHandler(404, `${type} not found`));
        }

        const location = data.rows;
        res.status(200).json({location, totalItems});
    } catch (error) {
        next(error);
    }
})

export default router;