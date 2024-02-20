import express from "express";
import pool from "../database/db.js";
import dotenv from 'dotenv';
import { errorHandler } from '../utils/error.js';
import { verifyToken } from '../utils/verifyToken.js';
dotenv.config();

const router = express.Router();

router.post('/createPost', verifyToken, async (req, res, next) => {
    const { user_id, title, place_tag, photo, content } = req.body;

    try {
        await pool.query("INSERT INTO blogs (user_id, title, place_tag, photo, content) VALUES ($1, $2, $3, $4, $5)",
            [user_id, title, place_tag, photo, content]);

        const result = await pool.query(
            "SELECT * FROM blogs WHERE user_id = $1 AND title = $2 AND place_tag = $3 AND photo = $4 AND content = $5",
            [user_id, title, place_tag, photo, content]
        );

        if (result.rows.length === 0) {
            return next(errorHandler(408, 'Something went wrong'));
        };
        const blog = result.rows[0]

        res.status(201).json(blog);

    } catch (error) {
        next(error);
    }
})

router.delete('/deleteBlog/:blogId', verifyToken, async (req, res, next) => {
    const { blogId } = req.params;
    try {
        await pool.query(`DELETE FROM blogs
        WHERE id = $1`,
        [blogId]);

        res.status(200).json('Successfully deleted');

    } catch (error) {
        next(error);
    }
})

// make it get the most recent
router.get('/getBlogs', async (req, res, next) => {
    let { page, limit, tag1, tag2 } = req.query;

    page = parseInt(page) || 1;
    const pageSize = limit || 8;
    const offset = (page - 1) * pageSize;

    try {
        let data;
        let data1;
        let data2;
        let blogs;

        if (tag1 && !tag2) {
            data = await pool.query(`SELECT *
                FROM blogs
                WHERE $1 ILIKE ANY(place_tag)
                ORDER BY created_at DESC
                LIMIT ${limit}`, 
                [tag1]);
            blogs = data.rows;
        } else if (tag1 && tag2) {
            data1 = await pool.query(`SELECT *
                FROM blogs
                WHERE $1 ILIKE ANY(place_tag)
                AND $2 ILIKE ANY(place_tag)
                ORDER BY created_at DESC
                LIMIT 5;`, 
                [tag1, tag2]);

            data2 = await pool.query(`SELECT *
                FROM blogs
                WHERE $1 ILIKE ANY(place_tag)
                ORDER BY created_at DESC
                LIMIT ${limit}`, 
                [tag2]);
            
            blogs = [...data1.rows, ...data2.rows]
            const compareObjects = (obj1, obj2) => {
              return obj1.id === obj2.id; 
            };
              
            blogs = blogs.filter((item, index, self) => 
              index === self.findIndex((t) => compareObjects(t, item))
            );

        } else {
            const countData = await pool.query('SELECT COUNT(*) FROM blogs');
            const totalItems = countData.rows[0].count;

            data = await pool.query(
                `SELECT * FROM blogs
                ORDER BY created_at DESC
                LIMIT $1
                OFFSET $2`,
                [pageSize, offset]
            );
            
            blogs = data.rows;

            if (blogs.length === 0) {
                return next(errorHandler(404, 'Blogs not found'));
            }

            return res.status(200).json({ blogs, totalItems });
        }

        if (blogs.length === 0) {
            return next(errorHandler(404, 'Blogs not found'));
        }

        res.status(200).json(blogs);

    } catch (error) {
        next(error);
    }
});

router.get('/getUserBlogs/:userId', async (req, res, next) => {
    const { userId } = req.params;
    try {
        const data = await pool.query("SELECT * FROM blogs WHERE user_id = $1",
        [userId]);

        if (data.rows.length === 0) {
            return next(errorHandler(404, 'No posted blogs'));
        };

        res.status(200).json(data.rows);

    } catch (error) {
        next(error);
    };
});

router.get('/getBlog/:blogId', async (req, res, next) => {
    const { blogId } = req.params;
    try {
        const data = await pool.query("SELECT * FROM blogs WHERE id = $1",
        [blogId]);

        if (data.rows.length === 0) {
            return next(errorHandler(404, 'Blogs not found'));
        }

        res.status(200).json(data.rows);

    } catch (error) {
        next(error);
    };
});

router.get('/searchBlogs', async (req, res, next) => {
    let { searchTerm, page, pageSize } = req.query;

    page = parseInt(page) || 1;
    pageSize = parseInt(pageSize) || 8;
    const offset = (page - 1) * pageSize;
    
    try {
        let totalItems;

        const countData = await pool.query(`SELECT COUNT(*)
            FROM blogs
            WHERE title ILIKE $1`,
            [`%${searchTerm}%`]);
        totalItems = countData.rows[0].count;

        const data = await pool.query(`SELECT *
            FROM blogs
            WHERE title ILIKE $1
            LIMIT ${pageSize}
            OFFSET ${offset}`,
            [`%${searchTerm}%`]);

        const blogs = data.rows;

        if (blogs.length === 0) {
            return next(errorHandler(404, 'Blogs not found'));
        };

        res.status(200).json({blogs, totalItems});
    } catch (error) {
        next(error);
    };
});

router.get('/filteredBlogs', async (req, res, next) => {
    let {type, page, pageSize} = req.query;

    page = parseInt(page) || 1;
    pageSize = parseInt(pageSize) || 8;
    const offset = (page - 1) * pageSize;

    try {
        let totalItems;

        const countData = await pool.query(`SELECT COUNT(*)
            FROM blogs
            WHERE $1 ILIKE ANY(place_tag)`,
            [type]);
        totalItems = countData.rows[0].count;

        const data = await pool.query(`SELECT *
            FROM blogs
            WHERE $1 ILIKE ANY(place_tag)
            LIMIT ${pageSize}
            OFFSET ${offset}`,
            [type]);
        const blogs = data.rows;

        if (blogs.length === 0) {
            return next(errorHandler(404, 'No blogs found'));
        }

        res.status(200).json({blogs, totalItems});
    } catch {
        next(error);
    };
});


export default router;