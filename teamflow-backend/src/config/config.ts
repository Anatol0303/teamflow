import { SignOptions } from 'jsonwebtoken';

export const config = {
    app: {
        port: Number(process.env.PORT) || 3000,
        nodeEnv: process.env.NODE_ENV || 'development',
    },

    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    },

    jwt: {
        secret: process.env.JWT_SECRET as string,
        expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as SignOptions['expiresIn'],
    },

    db: {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'teamflow',
    }
};

// 🔥 Проверка обязательных переменных
if (!config.jwt.secret) {
    throw new Error('JWT_SECRET is not defined');
}

if (!config.db.host || !config.db.username || !config.db.database) {
    throw new Error('Database configuration is incomplete');
}
