import { IsEnum, IsInt, Min } from 'class-validator';
import { TeamRole } from '../../../entities/TeamMember';

export class AddTeamMemberDto {

    @IsInt()
    @Min(1)
    userId!: number;

    @IsEnum(TeamRole)
    role!: TeamRole;
}