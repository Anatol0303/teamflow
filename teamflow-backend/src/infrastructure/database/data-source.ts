import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../../entities/User';
import {Team} from "../../entities/Team";
import {TeamMember} from "../../entities/TeamMember";
import { config } from '../../config/config';
export const AppDataSource = new DataSource({
    type: 'mysql',
    host: config.db.host,
    port: config.db.port,
    username: config.db.username,
    password: config.db.password,
    database: config.db.database,

    synchronize: true,
    logging: false,

    entities: [
        User,
        Team,
        TeamMember
    ],
});