import { Request, Response, NextFunction } from 'express';
import { ITeamService } from './team.service.interface';
import {GetTeamsDto} from "./dto/get-teams.dto";
import {BadRequestError} from "../../shared/errors/http-errors";

export class TeamController {

    constructor(
        private readonly teamService: ITeamService
    ) {}

    async getAllTeams(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {

            const teams =
                await this.teamService.getAllTeams();

            res.json(teams);

        } catch (err) {

            next(err);
        }
    }
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.body;
            const userId = req.user.userId;

            const team = await this.teamService.createTeam(name, userId);

            res.status(201).json(team);

        } catch (err) {
            next(err);
        }
    }

    async removeTeam(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {

            const teamId = Number(req.params.teamId);
            const currentUserId = req.user.userId;

            if (!Number.isInteger(teamId) || teamId <= 0) {
                throw new BadRequestError('teamId must be a positive integer');
            }

            await this.teamService.removeTeam(
                teamId,
                currentUserId
            );

            res.status(204).send();

        } catch (err) {

            next(err);
        }
    }

    async renameTeam(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {

            const teamId = Number(req.params.teamId);

            if (
                !Number.isInteger(teamId) ||
                teamId <= 0
            ) {
                throw new BadRequestError(
                    'Invalid teamId'
                );
            }
            const currentUserId = req.user.userId;

            const { name } = req.body;

            await this.teamService.renameTeam(
                teamId,
                currentUserId,
                name
            );

            res.status(204).send();

        } catch (err) {

            next(err);
        }
    }

    async getUserTeams(req: Request, res: Response, next: NextFunction) {

        try {
            const userId = req.user.userId;

            const { page = 1, limit = 10, search, sort, order }
                = req.query as unknown as GetTeamsDto;

            const result = await this.teamService.getUserTeams(
                userId,
                Number(page),
                Number(limit),
                search,
                sort,
                order
            );

            res.json(result);

        } catch (err) {
            next(err);
        }
    }

    async getUserOwnTeams(req: Request, res: Response, next: NextFunction) {

        try {
            const userId = req.user.userId;

            const { page = 1, limit = 10, search, sort, order }
                = req.query as unknown as GetTeamsDto;

            const result = await this.teamService.getUserOwnTeams(
                userId,
                Number(page),
                Number(limit),
                search,
                sort,
                order
            );

            res.json(result);

        } catch (err) {
            next(err);
        }
    }

    async getUserManageableTeams(
        req: Request,
        res: Response,
        next: NextFunction
    ) {

        try {

            const userId = req.user.userId;

            const {
                page = 1,
                limit = 10,
                search,
                sort,
                order
            } = req.query as unknown as GetTeamsDto;

            const result =
                await this.teamService.getUserManageableTeams(
                    userId,
                    Number(page),
                    Number(limit),
                    search,
                    sort,
                    order
                );

            res.json(result);

        } catch (err) {
            next(err);
        }
    }

    async getUserMemberTeams(
        req: Request,
        res: Response,
        next: NextFunction
    ) {

        try {

            const userId = req.user.userId;

            const {
                page = 1,
                limit = 10,
                search,
                sort,
                order
            } = req.query as unknown as GetTeamsDto;

            const result =
                await this.teamService.getUserMemberTeams(
                    userId,
                    Number(page),
                    Number(limit),
                    search,
                    sort,
                    order
                );

            res.json(result);

        } catch (err) {
            next(err);
        }
    }

    async addMember(req: Request, res: Response, next: NextFunction) {
        try {
            const teamId = Number(req.params.teamId);

            if (!Number.isInteger(teamId) || teamId < 1) {
                throw new BadRequestError(
                    'teamId must be a positive integer'
                );
            }
            const currentUserId = req.user.userId;

            const { userId, role } = req.body;

            await this.teamService.addTeamMember(
                teamId,
                currentUserId,
                userId,
                role
            );

            res.status(200).json({ message: 'Member added' });

        } catch (err) {
            next(err);
        }
    }

    async getMembers(req: Request, res: Response, next: NextFunction) {
        try {
            const teamId = Number(req.params.teamId);

            if (!Number.isInteger(teamId) || teamId < 1) {
                throw new BadRequestError(
                    'teamId must be a positive integer'
                );
            }
            const currentUserId = req.user.userId;

            const members = await this.teamService.getTeamMembers(
                teamId,
                currentUserId
            );

            res.json(members);

        } catch (err) {
            next(err);
        }
    }

    async getMyTeamsSelectList(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {

            const userId =
                req.user.userId;

            const teams =
                await this.teamService
                    .getMyTeamsSelectList(
                        userId
                    );

            res.json(teams);

        } catch (err) {

            next(err);
        }
    }

    async getMyRenameableTeamsSelectList(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId = req.user.userId;

            const teams =
                await this.teamService
                    .getMyRenameableTeamsSelectList(userId);

            res.json(teams);

        } catch (err) {
            next(err);
        }
    }

    async getMyManageableTeamsSelectList(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId = req.user.userId;

            const teams =
                await this.teamService
                    .getMyManageableTeamsSelectList(userId);

            res.json(teams);

        } catch (err) {
            next(err);
        }
    }

    async getMyOwnedTeamsSelectList(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId = req.user.userId;

            const teams =
                await this.teamService
                    .getMyOwnedTeamsSelectList(
                        userId
                    );

            res.json(teams);

        } catch (err) {
            next(err);
        }
    }

    async getMyTeamsForMemberRemoval(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {

            const userId = req.user.userId;

            const teams =
                await this.teamService
                    .getMyTeamsForMemberRemoval(
                        userId
                    );

            res.json(teams);

        } catch (err) {

            next(err);
        }
    }

    async getRemovableMembers(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {

            const teamId = Number(req.params.teamId);

            if (!Number.isInteger(teamId) || teamId < 1) {
                throw new BadRequestError(
                    'teamId must be a positive integer'
                );
            }

            const userId = req.user.userId;

            const members =
                await this.teamService.getRemovableMembers(
                    teamId,
                    userId
                );

            res.json(members);

        } catch (err) {

            next(err);
        }
    }

    async getMyTeamsForRoleUpdate(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {

            const userId = req.user.userId;

            const teams =
                await this.teamService
                    .getMyTeamsForRoleUpdate(
                        userId
                    );

            res.json(teams);

        } catch (err) {

            next(err);
        }
    }

    async getUpdatableMembers(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {

            const teamId = Number(req.params.teamId);

            if (!Number.isInteger(teamId) || teamId < 1) {
                throw new BadRequestError(
                    'teamId must be a positive integer'
                );
            }

            const currentUserId = req.user.userId;

            const members =
                await this.teamService
                    .getUpdatableMembers(
                        teamId,
                        currentUserId
                    );

            res.json(members);

        } catch (err) {

            next(err);
        }
    }

    async getAddableUsers(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {

            const teamId = Number(req.params.teamId);

            if (!Number.isInteger(teamId) || teamId < 1) {
                throw new BadRequestError(
                    'teamId must be a positive integer'
                );
            }

            const currentUserId =
                req.user.userId;

            const users =
                await this.teamService
                    .getAddableUsers(
                        teamId,
                        currentUserId
                    );

            res.json(users);

        } catch (err) {

            next(err);
        }
    }

    async updateMemberRole(req: Request, res: Response, next: NextFunction) {
        try {
            const teamId = Number(req.params.teamId);

            if (
                !Number.isInteger(teamId) ||
                teamId <= 0
            ) {
                throw new BadRequestError(
                    'teamId must be a positive integer'
                );
            }

            const currentUserId = req.user.userId;

            const userId = Number(req.params.userId);

            if (
                !Number.isInteger(userId) ||
                userId <= 0
            ) {
                throw new BadRequestError(
                    'userId must be a positive integer'
                );
            }

            const { role } = req.body;

            await this.teamService.updateMemberRole(
                teamId,
                currentUserId,
                userId,
                role
            );

            res.status(200).json({ message: 'Role updated' });

        } catch (err) {
            next(err);
        }
    }

    async removeMember(req: Request, res: Response, next: NextFunction) {
        try {
            const teamId = Number(req.params.teamId);
            const currentUserId = req.user.userId;
            const userId = Number(req.params.userId);

            if (!Number.isInteger(teamId) || teamId <= 0) {
                throw new BadRequestError(
                    'teamId must be a positive integer'
                );
            }

            if (!Number.isInteger(userId) || userId <= 0) {
                throw new BadRequestError(
                    'userId must be a positive integer'
                );
            }

            await this.teamService.removeMember(
                teamId,
                currentUserId,
                userId
            );

            res.status(204).send();

        } catch (err) {
            next(err);
        }
    }

    async getMyTeamsForOwnershipTransfer(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {

            const userId = req.user.userId;

            const teams =
                await this.teamService
                    .getMyTeamsForOwnershipTransfer(
                        userId
                    );

            res.json(teams);

        } catch (err) {

            next(err);
        }
    }

    async getTransferableMembers(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const teamId =
                Number(req.params.teamId);

            if (!Number.isInteger(teamId) || teamId <= 0) {
                throw new BadRequestError(
                    'teamId must be a positive integer'
                );
            }

            const currentUserId =
                req.user.userId;

            const members =
                await this.teamService
                    .getTransferableMembers(
                        teamId,
                        currentUserId
                    );

            res.json(members);

        } catch (err) {
            next(err);
        }
    }

    async transferOwnership(req: Request, res: Response, next: NextFunction)

    {
        try {
            const teamId = Number(req.params.teamId);
            const currentUserId = req.user.userId;
            const newOwnerId = Number(req.params.newOwnerId);

            if (
                !Number.isInteger(teamId) ||
                teamId <= 0
            ) {
                throw new BadRequestError(
                    'teamId must be a positive integer'
                );
            }

            if (
                !Number.isInteger(newOwnerId) ||
                newOwnerId <= 0
            ) {
                throw new BadRequestError(
                    'newOwnerId must be a positive integer'
                );
            }

            await this.teamService.transferOwnership(
                teamId,
                currentUserId,
                newOwnerId
            );

            res.status(204).send();

        } catch (err) {
            next(err);
        }

    }

    async transferOwnershipAndLeave(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {

            const teamId = Number(req.params.teamId);
            const currentUserId = req.user.userId;
            const newOwnerId = Number(req.params.newOwnerId);

            if (!Number.isInteger(teamId) || teamId <= 0) {
                throw new BadRequestError(
                    'teamId must be a positive integer'
                );
            }

            if (!Number.isInteger(newOwnerId) || newOwnerId <= 0) {
                throw new BadRequestError(
                    'newOwnerId must be a positive integer'
                );
            }

            await this.teamService.transferOwnershipAndLeave(
                teamId,
                currentUserId,
                newOwnerId
            );

            res.status(204).send();

        } catch (err) {

            next(err);
        }
    }
}