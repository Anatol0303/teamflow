import { AppDataSource } from '../../infrastructure/database/data-source';
import { IUserService } from './user.service.interface';
import { User, UserRole } from '../../entities/User';
import {MakeAdminResponseDto} from "./dto/make-admin-response.dto";
import { TeamMember } from '../../entities/TeamMember';
import { UserResponseDto } from './dto/user-response.dto';
import { BadRequestError } from '../../shared/errors/bad-request.error';
import { UnauthorizedError } from '../../shared/errors/unauthorized.error';
import { config } from '../../config/config';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Not } from 'typeorm';

export class UserServiceImpl implements IUserService {

    private userRepository = AppDataSource.getRepository(User);

    private async createUserInternal(
        email: string,
        password: string,
        role: UserRole
    ): Promise<User> {

        const existingUser = await this.userRepository.findOne({
            where: { email }
        });

        if (existingUser) {
            throw new BadRequestError('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = this.userRepository.create({
            email,
            password: hashedPassword,
            role
        });

        const savedUser = await this.userRepository.save(user);

        return savedUser;
    }

    async createAdmin(
        email: string,
        password: string
    ): Promise<{ token: string }> {

        const existAdmins = await this.getAllAdmins();

        if (existAdmins.length > 0) {
            throw new BadRequestError('During this time 1 admin has appeared in application.\nNow You can registrate only like usual USER');
        }

        const admin = await this.createUserInternal(
            email,
            password,
            UserRole.ADMIN
        );

        const token = jwt.sign(
            {
                userId: admin.userId,
                email: admin.email,
                role: admin.role
            },
            config.jwt.secret,
            {
                expiresIn: config.jwt.expiresIn
            }
        );

        return { token }

    }

    async createUser(
        email: string,
        password: string
    ): Promise<{ token: string }> {

        const existAdmins = await this.getAllAdmins();

        if (existAdmins.length <= 0) {
            throw new BadRequestError('There are not ADMIN in application\nYou can register only like ADMIN');
        }

        const user = await this.createUserInternal(
            email,
            password,
            UserRole.USER
        );

        const token = jwt.sign(
            {
                userId: user.userId,
                email: user.email,
                role: user.role
            },
            config.jwt.secret,
            {
                expiresIn: config.jwt.expiresIn
            }
        );

        return { token }

    }

    async login(
        email: string,
        password: string
    ): Promise<{ token: string }> {

        const user = await this.userRepository.findOne({
            where: { email },
            select: ['userId', 'email', 'password', 'role']
        });

        if (!user) {
            throw new UnauthorizedError('Invalid email or password');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new UnauthorizedError('Invalid email or password');
        }

        const token = jwt.sign(
            {
                userId: user.userId,
                email: user.email,
                role: user.role
            },
            config.jwt.secret,
            {
                expiresIn: config.jwt.expiresIn
            }
        );

        return { token }
    }

    async existNoExistAdmins(): Promise<boolean> {

        const admins = await this.getAllAdmins();

        return admins.length === 0;
    }

    async getAllUsers(): Promise<UserResponseDto[]> {

        const users = await this.userRepository.find({
            where: {
                role: UserRole.USER
            },
            select: ['userId', 'email', 'createdAt']
        });

        return users.map(user => ({
            id: user.userId,
            email: user.email,
            createdAt: user.createdAt,
        }));
    }

    async getAllAdmins(): Promise<UserResponseDto[]> {

        const users = await this.userRepository.find({
            where: {
                role: UserRole.ADMIN
            },
            select: ['userId', 'email', 'createdAt']
        });

        return users.map(user => ({
            id: user.userId,
            email: user.email,
            createdAt: user.createdAt,
        }));
    }

    async getMakeAdminSelectList(): Promise<UserResponseDto[]> {

        const teamMemberRepository =
            AppDataSource.getRepository(TeamMember);

        const users = await this.userRepository.find({
            where: {
                role: UserRole.USER
            }
        });

        if (users.length === 0) {
            throw new BadRequestError(
                'No USER accounts available'
            );
        }

        const teamMembers =
            await teamMemberRepository.find({
                relations: ['user']
            });

        const teamMemberUserIds = new Set(
            teamMembers.map(
                teamMember => teamMember.user.userId
            )
        );

        const availableUsers = users.filter(
            user => !teamMemberUserIds.has(user.userId)
        );

        if (availableUsers.length === 0) {
            throw new BadRequestError(
                'No users available to make ADMIN'
            );
        }

        return availableUsers.map(user => ({
            id: user.userId,
            email: user.email,
            createdAt: user.createdAt
        }));
    }

    async makeAdmin(
        userId: number
    ): Promise<MakeAdminResponseDto> {

        const user = await this.userRepository.findOne({
            where: { userId }
        });

        if (!user) {
            throw new BadRequestError('User not found');
        }

        if (user.role === UserRole.ADMIN) {
            throw new BadRequestError('User is already ADMIN');
        }

        const users =
            await this.getMakeAdminSelectList();

        const eligibleUser =
            users.find(user => user.id === userId);

        if (!eligibleUser) {
            throw new BadRequestError(
                'User is not eligible to become ADMIN'
            );
        }

        user.role = UserRole.ADMIN;

        const savedUser =
            await this.userRepository.save(user);

        return {
            id: savedUser.userId,
            email: savedUser.email,
            role: savedUser.role
        };
    }

    async getRemoveAdminSelectList(
        currentAdminId: number
    ): Promise<UserResponseDto[]> {

        const teamMemberRepository =
            AppDataSource.getRepository(TeamMember);

        const admins = await this.userRepository.find({
            where: {
                role: UserRole.ADMIN
            }
        });

        const teamMembers =
            await teamMemberRepository.find({
                relations: ['user']
            });

        const teamMemberUserIds = new Set(
            teamMembers.map(
                teamMember => teamMember.user.userId
            )
        );

        const availableAdmins = admins.filter(
            admin =>
                admin.userId !== currentAdminId &&
                !teamMemberUserIds.has(admin.userId)
        );

        return availableAdmins.map(admin => ({
            id: admin.userId,
            email: admin.email,
            createdAt: admin.createdAt
        }));
    }

    async removeAdmin(
        userId: number,
        currentAdminId: number
    ): Promise<void> {

        const user = await this.userRepository.findOne({
            where: { userId }
        });

        if (!user) {
            throw new BadRequestError('User not found');
        }

        if (userId === currentAdminId) {
            throw new BadRequestError(
                'To delete your own account, use the self-remove account'
            );
        }

        if (user.role !== UserRole.ADMIN) {
            throw new BadRequestError(
                'Only ADMIN accounts can be removed by ADMIN'
            );
        }

        const admins =
            await this.getRemoveAdminSelectList(
                currentAdminId
            );

        const eligibleAdmin = admins.find(
            admin => admin.id === userId
        );

        if (!eligibleAdmin) {
            throw new BadRequestError(
                'ADMIN is not eligible to be removed'
            );
        }

        await this.userRepository.remove(user);
    }

    async selfRemoveAdmin(
        currentAdminId: number
    ): Promise<void> {

        const user = await this.userRepository.findOne({
            where: {
                userId: currentAdminId
            }
        });

        if (!user) {
            throw new BadRequestError(
                'User not found'
            );
        }

        if (user.role !== UserRole.ADMIN) {
            throw new BadRequestError(
                'Only ADMIN accounts can use self-remove ADMIN'
            );
        }

        const teamMemberRepository =
            AppDataSource.getRepository(TeamMember);

        const teamMembership =
            await teamMemberRepository.findOne({
                where: {
                    user: {
                        userId: currentAdminId
                    }
                }
            });

        if (teamMembership) {
            throw new BadRequestError(
                'ADMIN cannot remove own account while being a member of a team'
            );
        }

        const anotherAdmin =
            await this.userRepository.findOne({
                where: {
                    role: UserRole.ADMIN,
                    userId: Not(currentAdminId)
                }
            });

        if (!anotherAdmin) {
            throw new BadRequestError(
                'Cannot remove yourself! You are only ADMIN'
            );
        }

        await this.userRepository.remove(user);
    }

    async selfRemoveUser(
        currentUserId: number
    ): Promise<void> {

        const user = await this.userRepository.findOne({
            where: {
                userId: currentUserId
            }
        });

        if (!user) {
            throw new BadRequestError(
                'User not found'
            );
        }

        if (user.role !== UserRole.USER) {
            throw new BadRequestError(
                'Only USER accounts can use self-remove USER'
            );
        }

        const teamMemberRepository =
            AppDataSource.getRepository(TeamMember);

        const teamMembership =
            await teamMemberRepository.findOne({
                where: {
                    user: {
                        userId: currentUserId
                    }
                }
            });

        if (teamMembership) {
            throw new BadRequestError(
                'USER cannot remove own account while being a member of a team'
            );
        }

        await this.userRepository.remove(user);
    }

    async changeEmail(
        currentUserId: number,
        role: UserRole,
        newEmail: string
    ): Promise<string> {

        const user = await this.userRepository.findOne({
            where: {
                userId: currentUserId
            }
        });

        if (!user) {
            throw new BadRequestError(
                'User not found'
            );
        }

        const existingUser =
            await this.userRepository.findOne({
                where: {
                    email: newEmail
                }
            });

        if (
            existingUser &&
            existingUser.userId !== currentUserId
        ) {
            throw new BadRequestError(
                'User with this email already exists'
            );
        }

        user.email = newEmail;

        await this.userRepository.save(user);

        const token = jwt.sign(
            {
                userId: currentUserId,
                email: newEmail,
                role: role
            },
            config.jwt.secret,
            {
                expiresIn: config.jwt.expiresIn
            }
        );

        return token;
    }

    async changePassword(
        currentUserId: number,
        currentPassword: string,
        newPassword: string
    ): Promise<void> {

        const user = await this.userRepository.findOne({
            where: {
                userId: currentUserId
            },
            select: ['password']
        });

        if (!user) {
            throw new BadRequestError(
                'User not found'
            );
        }

        const isPasswordValid =
            await bcrypt.compare(
                currentPassword,
                user.password
            );

        if (!isPasswordValid) {
            throw new BadRequestError(
                'Current password is incorrect'
            );
        }

        const hashedPassword =
            await bcrypt.hash(newPassword, 10);

        await this.userRepository.update(
            currentUserId,
            {
                password: hashedPassword
            }
        );
    }
}