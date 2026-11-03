import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors/app-error';

export const errorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: err.statusCode,
            message: err.message
        });
    }

    // Некорректный JSON в запросе
    if (
        err instanceof SyntaxError &&
        'status' in err &&
        err.status === 400 &&
        'body' in err
    ) {
        return res.status(400).json({
            status: 400,
            message: 'Invalid JSON'
        });
    }

    // неизвестная ошибка
    console.error(err);

    return res.status(500).json({
        status: 500,
        message: 'Internal Server Error'
    });
};