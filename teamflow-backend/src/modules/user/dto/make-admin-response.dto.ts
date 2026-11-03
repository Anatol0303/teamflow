import { UserRole } from '../../../entities/User';

export class MakeAdminResponseDto {
    id!: number;
    email!: string;
    role!: UserRole;
}