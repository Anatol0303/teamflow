import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../shared/errors/http-errors';
import { UserRole } from '../entities/User';
import { config } from '../config/config';
export const authMiddleware: RequestHandler = (req, res, next) => {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return next(new UnauthorizedError('No token provided'));
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return next(new UnauthorizedError('Invalid token format'));
    }

    try {
        const decoded = jwt.verify(token, config.jwt.secret!) as {
            userId: number;
            email: string;
            role: UserRole;
        };

        // 👇 теперь это работает благодаря express.d.ts
        req.user = decoded;

        next();

    } catch {
        return next(new UnauthorizedError('Invalid or expired token'));
    }
};