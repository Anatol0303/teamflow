import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../shared/errors/http-errors';

export const validateDto = (dtoClass: any, source: 'body' | 'query' = 'body') => {
    return async (req: Request, res: Response, next: NextFunction) => {

        const data = req[source];

        if (
            source === 'body' &&
            (data === undefined || data === null || typeof data !== 'object' || Array.isArray(data))
        ) {
            return next(new BadRequestError('Request body must be a JSON object'));
        }

        // 👉 преобразуем plain object → instance класса
        const dtoObject = plainToInstance(dtoClass, data);

        // 👉 валидируем
        const errors = await validate(dtoObject);

        if (errors.length > 0) {

            const messages = errors
                .map(err => Object.values(err.constraints || {}))
                .flat();

            return next(new BadRequestError(messages.join(', ')));
        }

        // 👉 можно заменить req.body на валидированный объект
        //req[source] = dtoObject;

        next();
    };
};