import { IsEnum } from 'class-validator';
import { TeamRole } from '../../../entities/TeamMember';

export class UpdateTeamMemberDto {

    @IsEnum(TeamRole)
    role!: TeamRole;

}