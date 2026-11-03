import express from 'express';
import cors from 'cors';
import userRoutes from './modules/user/user.routes';
import teamRoutes from './modules/team/team.routes';
import { errorMiddleware } from './middlewares/error.middleware';

export const app = express();

app.use(
    cors({
        origin: 'http://localhost:5173',
    })
);

app.use(express.json());

app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use('/users', userRoutes);
app.use('/teams', teamRoutes);
app.use(errorMiddleware);
