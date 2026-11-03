import { AppDataSource } from '../../infrastructure/database/data-source';
import { ITeamService } from './team.service.interface';

import { Team } from '../../entities/Team';
import { TeamMember, TeamRole } from '../../entities/TeamMember';
import {User, UserRole} from '../../entities/User';

import { EntityManager, Like, In, ObjectLiteral, EntityTarget } from 'typeorm';
import {BadRequestError, ForbiddenError, NotFoundError} from "../../shared/errors/http-errors";
import {TeamResponseDto} from "./dto/team-response.dto";

export class TeamServiceImpl implements ITeamService {

    private getRepo<T extends ObjectLiteral>(
        entity: EntityTarget<T>,
        manager?: EntityManager
    ) {
        return manager
            ? manager.getRepository(entity)
            : AppDataSource.getRepository(entity);
    }

    async getAllTeams(): Promise<TeamResponseDto[]> {

        const teamRepo = this.getRepo(Team);

        const teams = await teamRepo.find({
            select: {
                teamId: true,
                name: true,
                createdBy: {
                    userId: true
                },
                createdAt: true
            },
            relations: {
                createdBy: true
            }
        });

        return teams.map(team => ({
            teamId: team.teamId,
            name: team.name,
            createdBy: team.createdBy.userId,
            createdAt: team.createdAt,
        }));
    }

    async createTeam(name: string, userId: number): Promise<TeamResponseDto> {

        return await AppDataSource.transaction(async (manager) => {

            const userRepo = this.getRepo(User, manager);
            const teamRepo = this.getRepo(Team, manager);
            const teamMemberRepo = this.getRepo(TeamMember, manager);

            const user = await userRepo.findOne({
                where: { userId }
            });

            if (!user) {
                throw new NotFoundError('User not found');
            }

            const myOwnTeams = await this.getMyOwnedTeamsSelectList(userId);

            const nameInMyOwnTeams = myOwnTeams.some(team => team.name === name);

            if (nameInMyOwnTeams) {
                throw new BadRequestError('Error! You already own a team with this name');
            }

            const team = teamRepo.create({
                name,
                createdBy: user
            });

            const savedTeam = await teamRepo.save(team);

            const teamMember = teamMemberRepo.create({
                team: savedTeam,
                user,
                role: TeamRole.OWNER
            });

            await teamMemberRepo.save(teamMember);

            return {
                teamId: savedTeam.teamId,
                name: savedTeam.name,
                createdBy: savedTeam.createdBy.userId,
                createdAt: savedTeam.createdAt,
            };

        });
    }

    async renameTeam(
        teamId: number,
        currentUserId: number,
        name: string
    ): Promise<TeamResponseDto> {

        const userRepo = this.getRepo(User);
        const teamRepo = this.getRepo(Team);

        const user = await userRepo.findOne({
            where: { userId: currentUserId }
        });

        if (!user) {
            throw new NotFoundError('User not found');
        }

        const team = await teamRepo.findOne({
            where: { teamId },
            relations: {
                createdBy: true
            }
        });

        if (!team) {
            throw new NotFoundError('Team not found');
        }

        const renameableTeams =
            await this.getMyRenameableTeamsSelectList(currentUserId);

        const canRename = renameableTeams.some(
            team => team.teamId === teamId
        );

        if (!canRename) {
            throw new ForbiddenError(
                'You do not have permission to rename this team'
            );
        }

        const nameAlreadyExists = renameableTeams.some(
            team => team.teamId !== teamId && team.name === name
        );

        if (nameAlreadyExists) {
            throw new BadRequestError(
                'Error! You already have a renameable team with this name'
            );
        }

        team.name = name;

        const savedTeam = await teamRepo.save(team);

        return {
            teamId: savedTeam.teamId,
            name: savedTeam.name,
            createdBy: savedTeam.createdBy.userId,
            createdAt: savedTeam.createdAt,
        };
    }

    async getUserTeams(
        userId: number,
        page = 1,
        limit = 10,
        search?: string,
        sort: 'name' | 'createdAt' = 'createdAt',
        order: 'asc' | 'desc' = 'desc'
    ) {
        const teamMemberRepo = this.getRepo(TeamMember);

        const skip = (page - 1) * limit;

        const whereCondition: any = {
            user: { userId }
        };

        if (search) {
            whereCondition.team = {
                name: Like(`%${search}%`)
            };
        }

        const [teamMembers, total] = await teamMemberRepo.findAndCount({
            where: whereCondition,
            relations: ['team'],
            skip,
            take: limit,
            order: {
                team: {
                    [sort]: order.toUpperCase(),
                    teamId: 'ASC'
                }
            }
        });

        const teams = teamMembers.map(tm => ({
            ...tm.team,
            role: tm.role,
        }));
        return {
            data: teams,
            meta: {
                total,
                page,
                limit
            }
        };
    }

    async getUserOwnTeams(
        userId: number,
        page = 1,
        limit = 10,
        search?: string,
        sort: 'name' | 'createdAt' = 'createdAt',
        order: 'asc' | 'desc' = 'desc'
    ) {
        const teamMemberRepo = this.getRepo(TeamMember);

        const skip = (page - 1) * limit;

        const whereCondition: any = {
            user: { userId },
            role: TeamRole.OWNER
        };

        if (search) {
            whereCondition.team = {
                name: Like(`%${search}%`)
            };
        }

        const [teamMembers, total] = await teamMemberRepo.findAndCount({
            where: whereCondition,
            relations: ['team'],
            skip,
            take: limit,
            order: {
                team: {
                    [sort]: order.toUpperCase(),
                    teamId: 'ASC'
                }
            }
        });

        const teams = teamMembers.map(tm => tm.team);

        return {
            data: teams,
            meta: {
                total,
                page,
                limit
            }
        };
    }

    async getUserManageableTeams(
        userId: number,
        page = 1,
        limit = 10,
        search?: string,
        sort: 'name' | 'createdAt' = 'createdAt',
        order: 'asc' | 'desc' = 'desc'
    ) {
        const teamMemberRepo = this.getRepo(TeamMember);

        const skip = (page - 1) * limit;

        const whereCondition: any = {
            user: { userId },
            role: TeamRole.MANAGER
        };

        if (search) {
            whereCondition.team = {
                name: Like(`%${search}%`)
            };
        }

        const [teamMembers, total] =
            await teamMemberRepo.findAndCount({
                where: whereCondition,
                relations: ['team'],
                skip,
                take: limit,
                order: {
                    team: {
                        [sort]: order.toUpperCase(),
                        teamId: 'ASC'
                    }
                }
            });

        const teams = teamMembers.map(
            tm => tm.team
        );

        return {
            data: teams,
            meta: {
                total,
                page,
                limit
            }
        };
    }

    async getUserMemberTeams(
        userId: number,
        page = 1,
        limit = 10,
        search?: string,
        sort: 'name' | 'createdAt' = 'createdAt',
        order: 'asc' | 'desc' = 'desc'
    ) {
        const teamMemberRepo = this.getRepo(TeamMember);

        const skip = (page - 1) * limit;

        const whereCondition: any = {
            user: { userId },
            role: TeamRole.MEMBER
        };

        if (search) {
            whereCondition.team = {
                name: Like(`%${search}%`)
            };
        }

        const [teamMembers, total] =
            await teamMemberRepo.findAndCount({
                where: whereCondition,
                relations: ['team'],
                skip,
                take: limit,
                order: {
                    team: {
                        [sort]: order.toUpperCase(),
                        teamId: 'ASC'
                    }
                }
            });

        const teams = teamMembers.map(
            tm => tm.team
        );

        return {
            data: teams,
            meta: {
                total,
                page,
                limit
            }
        };
    }

    async getMyRenameableTeamsSelectList(
        userId: number
    ) {

        const renameableTeams = await this.getMyOwnedTeamsSelectList(userId);
        return renameableTeams;
    }

    async getMyOwnedTeamsSelectList(
        userId: number
    ) {

        const teamMemberRepo =
            this.getRepo(TeamMember);

        const members =
            await teamMemberRepo.find({

                where: {
                    user: { userId },
                    role: TeamRole.OWNER
                },

                relations: ['team'],

                order: {
                    team: {
                        name: 'ASC'
                    }
                }
            });

        return members.map(member => ({
            teamId: member.team.teamId,
            name: member.team.name
        }));
    }

    async addTeamMember(
        teamId: number,
        currentUserId: number,
        userId: number,
        role: TeamRole
    ): Promise<void> {

        const teamRepo =
            this.getRepo(Team);

        const teamMemberRepo =
            this.getRepo(TeamMember);

        const team =
            await teamRepo.findOne({
                where: { teamId }
            });

        if (!team) {
            throw new NotFoundError(
                'Team not found'
            );
        }

        const currentMember =
            await teamMemberRepo.findOne({
                where: {
                    team: { teamId },
                    user: { userId: currentUserId }
                }
            });

        if (!currentMember) {
            throw new ForbiddenError(
                'You are not in this team'
            );
        }

        if (
                currentMember.role !== TeamRole.OWNER &&
                currentMember.role !== TeamRole.MANAGER

        ) {
            throw new ForbiddenError(
                'Only OWNER or MANAGER can add members'
            );
        }

        const userRepo =
            this.getRepo(User);

        const user =
            await userRepo.findOne({
                where: { userId }
            });

        if (!user) {
            throw new NotFoundError(
                'User not found'
            );
        }

        if (user.role === UserRole.ADMIN) {
            throw new BadRequestError(
                'Cannot add ADMIN to team'
            );
        }

        if (role === TeamRole.OWNER) {
            throw new BadRequestError(
                'Use transfer ownership to assign OWNER role'
            );
        }

        const addableUsers =
            await this.getAddableUsers(
                teamId,
                currentUserId
            );

        if (addableUsers.length === 0) {
            throw new BadRequestError(
                'No users available to add'
            );
        }

        const isAddable =
            addableUsers.some(
                addableUser =>
                    addableUser.userId === userId
            );

        if (!isAddable) {
            throw new BadRequestError(
                'User is already in team'
            );
        }

        const member =
            teamMemberRepo.create({
                team,
                user,
                role
            });

        await teamMemberRepo.save(member);
    }

    async getTeamMembers(
        teamId: number,
        currentUserId: number
    ) {
        const teamRepo = this.getRepo(Team);
        const teamMemberRepo = this.getRepo(TeamMember);

        const team = await teamRepo.findOne({
            where: { teamId }
        });

        if (!team) {
            throw new NotFoundError('Team not found');
        }

        const currentMember = await teamMemberRepo.findOne({
            where: {
                team: { teamId },
                user: { userId: currentUserId }
            }
        });

        if (!currentMember) {
            throw new ForbiddenError('Access denied');
        }

        const members = await teamMemberRepo.find({
            where: {
                team: { teamId }
            },
            relations: ['user']
        });

        return members.map(member => ({
            userId: member.user.userId,
            email: member.user.email,
            role: member.role
        }));
    }

    async getMyManageableTeamsSelectList(
        userId: number
    ) {
        const teamMemberRepo =
            this.getRepo(TeamMember);

        const members =
            await teamMemberRepo.find({
                where: {
                    user: { userId },
                    role: In([
                        TeamRole.OWNER,
                        TeamRole.MANAGER
                    ])
                },
                relations: ['team'],
                order: {
                    team: {
                        name: 'ASC'
                    }
                }
            });

        return members.map(member => ({
            teamId: member.team.teamId,
            name: member.team.name
        }));
    }

    async getMyTeamsForMemberRemoval(
        userId: number
    ) {
        const teams =
            await this.getMyManageableTeamsSelectList(
                userId
            );

        const result: {
            teamId: number;
            name: string;
        }[] = [];

        for (const team of teams) {

            const removableMembers =
                await this.getRemovableMembers(
                    team.teamId,
                    userId
                );

            if (removableMembers.length > 0) {
                result.push(team);
            }
        }

        return result;
    }

    async getRemovableMembers(
        teamId: number,
        currentUserId: number
    ): Promise<{
        userId: number;
        email: string;
        role: TeamRole;
    }[]> {

        const teamRepo = this.getRepo(Team);

        const teamMemberRepo = this.getRepo(TeamMember);

        const team =
            await teamRepo.findOne({
                where: { teamId }
            });

        if (!team) {
            throw new NotFoundError(
                'Team not found'
            );
        }

        const current = await teamMemberRepo.findOne({
            where: {
                team: { teamId },
                user: { userId: currentUserId }
            }
        });

        if (!current) {
            throw new ForbiddenError('Access denied');
        }

        if (
            current.role !== TeamRole.OWNER &&
            current.role !== TeamRole.MANAGER
        ) {
            throw new ForbiddenError('Insufficient permissions');
        }
        const members = await teamMemberRepo.find({
            where: {
                team: { teamId }
            },
            relations: ['user']
        });

        if (current.role === TeamRole.OWNER) {

            return members
                .filter(member =>
                    member.user.userId !== currentUserId &&
                    member.role !== TeamRole.OWNER
                )
                .map(member => ({
                    userId: member.user.userId,
                    email: member.user.email,
                    role: member.role
                }));
        }

        if (current.role === TeamRole.MANAGER) {

            return members
                .filter(member =>
                    member.role === TeamRole.MEMBER
                )
                .map(member => ({
                    userId: member.user.userId,
                    email: member.user.email,
                    role: member.role
                }));
        }
        return [];
    }

    async getMyTeamsForRoleUpdate(
        userId: number
    ): Promise<{
        teamId: number;
        name: string;
    }[]> {

        const teams =
            await this.getMyOwnedTeamsSelectList(
                userId
            );

        const result: {
            teamId: number;
            name: string;
        }[] = [];

        for (const team of teams) {

            const updatableMembers =
                await this.getUpdatableMembers(
                    team.teamId,
                    userId
                );

            if (updatableMembers.length > 0) {
                result.push(team);
            }
        }

        return result;
    }

    async getUpdatableMembers(
        teamId: number,
        currentUserId: number
    ): Promise<{
        userId: number;
        email: string;
        role: TeamRole;
    }[]> {

        const teamRepo =
            this.getRepo(Team);

        const team =
            await teamRepo.findOne({
                where: {
                    teamId
                }
            });

        if (!team) {
            throw new NotFoundError(
                'Team not found'
            );
        }

        const teamMemberRepo =
            this.getRepo(TeamMember);

        const members =
            await teamMemberRepo.find({
                where: {
                    team: {
                        teamId
                    }
                },
                relations: ['user']
            });

        const currentMember =
            members.find(
                member =>
                    member.user.userId === currentUserId
            );

        if (!currentMember) {
            throw new ForbiddenError(
                'Access denied'
            );
        }

        if (
            currentMember.role !== TeamRole.OWNER
        ) {
            throw new ForbiddenError(
                'Insufficient permissions'
            );
        }

        return members
            .filter(member =>
                member.user.userId !== currentUserId &&
                member.role !== TeamRole.OWNER
            )
            .map(member => ({
                userId: member.user.userId,
                email: member.user.email,
                role: member.role
            }));
    }

    async getAddableUsers(
        teamId: number,
        currentUserId: number
    ) {
        const teamRepo =
            this.getRepo(Team);

        const userRepo =
            this.getRepo(User);

        const teamMemberRepo =
            this.getRepo(TeamMember);

        const team =
            await teamRepo.findOne({
                where: { teamId }
            });

        if (!team) {
            throw new NotFoundError(
                'Team not found'
            );
        }

        const currentMember =
            await teamMemberRepo.findOne({
                where: {
                    team: { teamId },
                    user: {
                        userId: currentUserId
                    }
                }
            });

        if (!currentMember) {
            throw new ForbiddenError(
                'Access denied'
            );
        }

        if (
            currentMember.role !== TeamRole.OWNER &&
            currentMember.role !== TeamRole.MANAGER
        ) {
            throw new ForbiddenError(
                'Insufficient permissions'
            );
        }

        const users = await userRepo.find();

        const teamMembers = await teamMemberRepo.find({
            where: {
                team: {
                    teamId
                }
            },
            relations: ['user']
        });

        return users
            .filter(user =>
                user.role !== UserRole.ADMIN &&
                !teamMembers.some(
                    member =>
                        member.user.userId === user.userId
                )
            )
            .map(user => ({
                userId: user.userId,
                email: user.email
            }));

    }

    async removeMember(
        teamId: number,
        currentUserId: number,
        userId: number
    ): Promise<void> {

        const teamRepo =
            this.getRepo(Team);

        const team =
            await teamRepo.findOne({
                where: { teamId }
            });

        if (!team) {
            throw new NotFoundError(
                'Team not found'
            );
        }

        const userRepo =
            this.getRepo(User);

        const user =
            await userRepo.findOne({
                where: { userId }
            });

        if (!user) {
            throw new NotFoundError(
                'User not found'
            );
        }

        const removableMembers =
            await this.getRemovableMembers(
                teamId,
                currentUserId
            );

        if (removableMembers.length === 0) {
            throw new BadRequestError(
                'No members available to remove'
            );
        }

        const teamMemberRepo =
            this.getRepo(TeamMember);

        const member =
            await teamMemberRepo.findOne({
                where: {
                    team: { teamId },
                    user: { userId }
                }
            });

        if (!member) {
            throw new NotFoundError(
                'Member not found'
            );
        }

        if (userId === currentUserId) {
            throw new BadRequestError(
                'Cannot remove yourself'
            );
        }

        if (member.role === TeamRole.OWNER) {
            throw new BadRequestError(
                'Cannot remove owner'
            );
        }

        const isRemovable =
            removableMembers.some(
                removableMember =>
                    removableMember.userId === userId
            );

        if (!isRemovable) {
            throw new BadRequestError(
                'Manager cannot remove another manager'
            );
        }

        await teamMemberRepo.remove(member);
    }

    async removeTeam(
        teamId: number,
        currentUserId: number
    ): Promise<void> {

        await AppDataSource.transaction(async (manager) => {

            const teamRepo = this.getRepo(Team, manager);
            const teamMemberRepo = this.getRepo(TeamMember, manager);

            const team =
                await teamRepo.findOne({
                    where: { teamId }
                });

            if (!team) {
                throw new NotFoundError('Team not found');
            }
            const currentMember =
                await teamMemberRepo.findOne({
                    where: {
                        team: { teamId },
                        user: { userId: currentUserId }
                    }
                });

            if (!currentMember) {
                throw new ForbiddenError('Access denied');
            }

            if (currentMember.role !== TeamRole.OWNER) {
                throw new ForbiddenError(
                    'Only owner can remove team'
                );
            }

            await teamMemberRepo.delete({
                team: { teamId }
            });

            await teamRepo.remove(team);
        });
    }

    async getMyTeamsSelectList(
        userId: number
    ) {

        const teamMemberRepo =
            this.getRepo(TeamMember);

        const members =
            await teamMemberRepo.find({

                where: {
                    user: { userId }
                },

                relations: ['team'],

                order: {
                    team: {
                        name: 'ASC'
                    }
                }
            });

        return members.map(member => ({
            teamId: member.team.teamId,
            name: member.team.name
        }));
    }

    async updateMemberRole(
        teamId: number,
        currentUserId: number,
        userId: number,
        role: TeamRole
    ): Promise<void> {

        if (userId === currentUserId) {
            throw new BadRequestError(
                'Cannot change your own role'
            );
        }

        const repo =
            this.getRepo(TeamMember);

        const userRepo =
            this.getRepo(User);

        const teamRepo =
            this.getRepo(Team);

        const user =
            await userRepo.findOne({
                where: { userId }
            });

        if (!user) {
            throw new NotFoundError(
                'Member not found'
            );
        }

        const team =
            await teamRepo.findOne({
                where: { teamId }
            });

        if (!team) {
            throw new NotFoundError(
                'Team not found'
            );
        }

        const current =
            await repo.findOne({
                where: {
                    team: { teamId },
                    user: {
                        userId: currentUserId
                    }
                }
            });

        if (!current) {
            throw new ForbiddenError(
                'Access denied'
            );
        }

        if (
            current.role !== TeamRole.OWNER
        ) {
            throw new ForbiddenError(
                'Insufficient permissions'
            );
        }

        const member =
            await repo.findOne({
                where: {
                    team: { teamId },
                    user: { userId }
                }
            });

        if (!member) {
            throw new NotFoundError(
                'This member does not exist in this team'
            );
        }

        if (member.role === TeamRole.OWNER) {
            throw new ForbiddenError(
                'Cannot change owner'
            );
        }

        const updatableMembers =
            await this.getUpdatableMembers(
                teamId,
                currentUserId
            );

        if (updatableMembers.length === 0) {
            throw new BadRequestError(
                'No members available to update'
            );
        }

        const isUpdatable =
            updatableMembers.some(
                updatableMember =>
                    updatableMember.userId === userId
            );

        if (!isUpdatable) {
            throw new BadRequestError(
                'Member cannot be updated'
            );
        }

        if (role === TeamRole.OWNER) {
            throw new BadRequestError(
                'Use transfer ownership'
            );
        }

        member.role = role;

        await repo.save(member);
    }

    async getMyTeamsForOwnershipTransfer(
        userId: number
    ) {
        const teams =
            await this.getMyOwnedTeamsSelectList(
                userId
            );

        const result: {
            teamId: number;
            name: string;
        }[] = [];

        for (const team of teams) {

            const transferableMembers =
                await this.getTransferableMembers(
                    team.teamId,
                    userId
                );

            if (transferableMembers.length > 0) {
                result.push(team);
            }
        }

        return result;
    }

    async getTransferableMembers(
        teamId: number,
        currentUserId: number
    ): Promise<{
        userId: number;
        email: string;
        role: TeamRole;
    }[]> {

        const teamRepo =
            this.getRepo(Team);

        const team =
            await teamRepo.findOne({
                where: {
                    teamId
                }
            });

        if (!team) {
            throw new NotFoundError(
                'Team not found'
            );
        }

        const teamMemberRepo =
            this.getRepo(TeamMember);

        const currentOwner =
            await teamMemberRepo.findOne({
                where: {
                    team: { teamId },
                    user: {
                        userId: currentUserId
                    }
                }
            });

        if (!currentOwner) {
            throw new ForbiddenError(
                'Access denied'
            );
        }

        if (
            currentOwner.role !== TeamRole.OWNER
        ) {
            throw new ForbiddenError(
                'Insufficient permissions'
            );
        }

        const members =
            await teamMemberRepo.find({
                where: {
                    team: { teamId }
                },
                relations: ['user']
            });

        const owners =
            members.filter(
                member =>
                    member.role === TeamRole.OWNER
            );

        if (owners.length !== 1) {
            throw new Error(
                `Data integrity error: team ${teamId} has ${owners.length} owners`
            );
        }

        const sameNameTeams = await teamRepo.find({
            where: {
                name: team.name
            }
        });

        const otherTeamIds = sameNameTeams
            .filter(otherTeam => otherTeam.teamId !== teamId)
            .map(otherTeam => otherTeam.teamId);

        let otherOwners: TeamMember[] = [];

        if (otherTeamIds.length > 0) {
            otherOwners = await teamMemberRepo.find({
                where: {
                    role: TeamRole.OWNER,
                    team: {
                        teamId: In(otherTeamIds)
                    }
                },
                relations: ['user']
            });
        }

        return members
            .filter(member =>
                member.role !== TeamRole.OWNER &&
                !otherOwners.some(
                    owner => owner.user.userId === member.user.userId
                )
            )
            .map(member => ({
                userId: member.user.userId,
                email: member.user.email,
                role: member.role
            }));
    }

    async transferOwnership(
        teamId: number,
        currentUserId: number,
        newOwnerId: number
    ): Promise<void> {

        await AppDataSource.transaction(async (manager) => {
            const teamRepo = this.getRepo(Team, manager);

            const team = await teamRepo.findOne({
                where: { teamId }
            });

            if (!team) {
                throw new NotFoundError('Team not found');
            }
            const teamMemberRepo =
                this.getRepo(TeamMember, manager);

            const currentOwner =
                await teamMemberRepo.findOne({
                    where: {
                        team: { teamId },
                        user: {
                            userId: currentUserId
                        }
                    }
                });

            if (!currentOwner) {
                throw new ForbiddenError('Access denied');
            }

            if (currentOwner.role !== TeamRole.OWNER) {
                throw new ForbiddenError('Insufficient permissions');
            }

            const target =
                await teamMemberRepo.findOne({
                    where: {
                        team: { teamId },
                        user: {
                            userId: newOwnerId
                        }
                    }
                });

            if (!target) {
                throw new NotFoundError(
                    'This member is not in team'
                );
            }

            const transferableMembers =
                await this.getTransferableMembers(
                    teamId,
                    currentUserId
                );

            const isTransferable =
                transferableMembers.some(
                    member => member.userId === newOwnerId
                );

            if (!isTransferable) {
                throw new BadRequestError(
                    'This member cannot be OWNER'
                );
            }

            currentOwner.role = TeamRole.MANAGER;
            target.role = TeamRole.OWNER;

            await manager.save([
                currentOwner,
                target
            ]);
        });
    }

    async transferOwnershipAndLeave(
        teamId: number,
        currentUserId: number,
        newOwnerId: number
    ): Promise<void> {

        await AppDataSource.transaction(async (manager) => {
            const teamRepo = this.getRepo(Team, manager);

            const team = await teamRepo.findOne({
                where: { teamId }
            });

            if (!team) {
                throw new NotFoundError('Team not found');
            }
            const teamMemberRepo =
                this.getRepo(TeamMember, manager);

            const currentOwner =
                await teamMemberRepo.findOne({
                    where: {
                        team: { teamId },
                        user: {
                            userId: currentUserId
                        }
                    }
                });

            if (!currentOwner) {
                throw new ForbiddenError('Access denied');
            }

            if (currentOwner.role !== TeamRole.OWNER) {
                throw new ForbiddenError('Insufficient permissions');
            }

            const target =
                await teamMemberRepo.findOne({
                    where: {
                        team: { teamId },
                        user: {
                            userId: newOwnerId
                        }
                    }
                });

            if (!target) {
                throw new NotFoundError(
                    'This member is not in team'
                );
            }

            const transferableMembers =
                await this.getTransferableMembers(
                    teamId,
                    currentUserId
                );

            const isTransferable =
                transferableMembers.some(
                    member => member.userId === newOwnerId
                );

            if (!isTransferable) {
                throw new BadRequestError(
                    'This member cannot be OWNER'
                );
            }

            target.role = TeamRole.OWNER;

            await manager.save([
                target
            ]);

            await manager.remove([
                currentOwner
            ]);

        });
    }
}