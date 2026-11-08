import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './infrastructure/swagger/swagger';

import teamRoutes from './modules/team/team.routes';
import userRoutes from './modules/user/user.routes';

import { errorMiddleware } from './middlewares/error.middleware';
import { config } from './config/config';
import { AppDataSource } from './infrastructure/database/data-source';

const app = express();
app.use(
    cors({
        origin: config.cors.origin,
    })
);
app.use(express.json());

// 🔹 routes
app.use('/teams', teamRoutes);
app.use('/users', userRoutes);

// 🔹 swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 🔹 error handler (ВСЕГДА В КОНЦЕ)
app.use(errorMiddleware);

// 🔥 ВАЖНО: запуск только после подключения к БД
AppDataSource.initialize()
    .then(() => {
        console.log('Database connected');

        app.listen(config.app.port, () => {
            console.log(`Server running on port ${config.app.port}`);
        });
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });