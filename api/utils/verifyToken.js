import { errorHandler } from "./error.js";
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
            return next(errorHandler(401, "No refresh token"));
        } else {
            jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
                if(err) return next(errorHandler(400, "Invalid Token"))

                const token = jwt.sign({id: decoded.id}, process.env.JWT_SECRET, { expiresIn: '1h' });
                console.log(token);
                res.cookie('access_token', token, {maxAge: 3600000, httpOnly: true, sameSite: 'strict' });
                
                jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
                    if(err) return next(errorHandler(403, "Forbidden"));
                
                    req.user = user;
                    next();
                });
            });
        };
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if(err) return next(errorHandler(403, "Forbidden"));
        
            req.user = user;
            next();
        });
    };
};
