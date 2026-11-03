import { Request, Response, NextFunction } from 'express';
import { IUserService } from './user.service.interface';
import {BadRequestError} from "../../shared/errors/http-errors";

export class UserController {

    constructor(private readonly userService: IUserService) {}

    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;

            const user = await this.userService.createUser(email, password);

            res.status(201).json(user);
        } catch (err) {
            next(err);
        }
    }

    async createAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;

            const admin = await this.userService.createAdmin(email, password);

            res.status(201).json(admin);
        } catch (err) {
            next(err);
        }
    }

    async getAllUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await this.userService.getAllUsers();
            res.json(users);
        } catch (err) {
            next(err);
        }
    }

    async existNoExistAdmins(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const admins =
                await this.userService.existNoExistAdmins();

            res.status(200).json(admins);

        } catch (err) {
            next(err);
        }
    }

    async getAllAdmins(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const admins =
                await this.userService.getAllAdmins();

            res.status(200).json(admins);

        } catch (err) {
            next(err);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;

            const result = await this.userService.login(email, password);

            res.status(200).json(result);
        } catch (err) {
            next(err);
        }
    }

    async getMakeAdminSelectList(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const users =
                await this.userService.getMakeAdminSelectList();

            res.status(200).json(users);
        } catch (err) {
            next(err);
        }
    }

    async makeAdmin(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId = Number(req.params.userId);

            if (!Number.isInteger(userId) || userId <= 0) {
                throw new BadRequestError('Invalid userId');
            }

            const user = await this.userService.makeAdmin(userId);

            res.status(200).json(user);
        } catch (err) {
            next(err);
        }
    }

    async getRemoveAdminSelectList(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const currentAdminId = req.user.userId;

            const users =
                await this.userService.getRemoveAdminSelectList(
                    currentAdminId
                );

            res.status(200).json(users);
        } catch (err) {
            next(err);
        }
    }


    async removeAdmin(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId = Number(req.params.userId);
            const currentAdminId = req.user.userId;

            if (!Number.isInteger(userId) || userId <= 0) {
                throw new BadRequestError('Invalid userId');
            }

            await this.userService.removeAdmin(
                userId,
                currentAdminId
            );

            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }

    async selfRemoveAdmin(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const currentAdminId = req.user.userId;

            await this.userService.selfRemoveAdmin(
                currentAdminId
            );

            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }

    async selfRemoveUser(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const currentUserId = req.user.userId;

            await this.userService.selfRemoveUser(
                currentUserId
            );

            res.status(204).send();
        } catch (err) {
            next(err);
        }
    }

    async changeEmail(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const currentUserId = req.user.userId;
            const currentUserRole = req.user.role;
            const { newEmail } = req.body;

            const token =
                await this.userService.changeEmail(
                    currentUserId,
                    currentUserRole,
                    newEmail
                );

            res.status(200).json({
                token
            });

        } catch (err) {
            next(err);
        }
    }

    async changePassword(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const currentUserId = req.user.userId;

            const {
                currentPassword,
                newPassword
            } = req.body;

            await this.userService.changePassword(
                currentUserId,
                currentPassword,
                newPassword
            );

            res.status(204).send();

        } catch (err) {
            next(err);
        }
    }
}