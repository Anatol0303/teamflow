import { UserResponseDto } from './dto/user-response.dto';
import { MakeAdminResponseDto } from './dto/make-admin-response.dto';
import { UserRole } from '../../entities/User';
export interface IUserService {

    createUser(
        email: string,
        password: string
    ): Promise<{ token: string }>;

    createAdmin(
        email: string,
        password: string
    ): Promise<{ token: string }>;

    login(
        email: string,
        password: string
    ): Promise<{ token: string }>;

    getAllUsers(): Promise<UserResponseDto[]>;

    getAllAdmins(): Promise<UserResponseDto[]>;

    existNoExistAdmins(): Promise<Boolean>;

    getMakeAdminSelectList(): Promise<UserResponseDto[]>;

    makeAdmin(
        userId: number
    ): Promise<MakeAdminResponseDto>;

    getRemoveAdminSelectList(
        currentAdminId: number
    ): Promise<UserResponseDto[]>;

    removeAdmin(
        userId: number,
        currentAdminId: number
    ): Promise<void>;

    selfRemoveAdmin(currentAdminId: number): Promise<void>;

    selfRemoveUser(currentUserId: number): Promise<void>;

    changeEmail(
        currentUserId: number,
        role: UserRole,
        newEmail: string
    ): Promise<string>;

    changePassword(
        currentUserId: number,
        currentPassword: string,
        newPassword: string
    ): Promise<void>;

}