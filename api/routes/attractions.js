import express from "express";
import dotenv from 'dotenv';
import pool from "../database/db.js";
import { errorHandler } from '../utils/error.js';
dotenv.config();

const router = express.Router();

router.get('/getAttractions', async (req, res, next) => {
    const apiKey = process.env.GEOAPIFY_API_KEY;
    const place = req.query.place;
    const category = req.query.category;
    const limit = req.query.limit || 4;
    console.log(req.query.category);

    const data = await getCategories()
    const categories = data.map((datum) => datum.category);

    if (!categories.includes(category)) {
        return next(errorHandler(404, 'Category not found'));
    }
    
    const geoParams = new URLSearchParams();
    geoParams.set('text', place);
    geoParams.set('format', 'json');
    geoParams.set('apiKey', apiKey);
    const geoCodeParams = geoParams.toString();

    const geoCodeUrl = `https://api.geoapify.com/v1/geocode/search?${geoCodeParams}`;

    try {
        const response = await fetch(geoCodeUrl);
        const data = await response.json();
        const place_id = data.results[0].place_id;
        console.log(place_id);

        const placesQuery = `categories=${category}&filter=place:${place_id}&limit=${limit}&apiKey=${apiKey}`;
        const placesUrl = `https://api.geoapify.com/v2/places?${placesQuery}`;

        const searchRes = await fetch(placesUrl);
        const { features } = await searchRes.json();
        console.log(features.length);

        if (features.length > 0) {
            console.log('success')
            return res.status(200).json(features);
        } else {
            console.log('failed')
            return next(errorHandler(404, 'No attractions found'));
        }

    } catch (error) {
        next(error);
    }
})

router.get('/getCategories', async (req, res, next) => {
    try {
        const categories = await getCategories();
        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
});

const getCategories = async () => {
    try {
      const keys = await pool.query(`SELECT category FROM categories`);
  
      if (keys.rows.length === 0) {
        throw errorHandler(404, 'Categories not found');
      }
  
      return keys.rows;
    } catch (error) {
      throw error;
    }
};

export default router;