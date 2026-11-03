import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../shared/errors/http-errors';
import { UserRole } from '../entities/User';

export const rolesMiddleware = (...allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {

        const user = req.user;

        if (!user) {
            return next(new ForbiddenError('Access denied'));
        }

        if (!allowedRoles.includes(user.role as UserRole)) {
            return next(new ForbiddenError('Insufficient permissions'));
        }

        next();
    };
};