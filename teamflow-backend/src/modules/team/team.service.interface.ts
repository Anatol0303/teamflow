import { Team } from '../../entities/Team';
import { TeamRole } from '../../entities/TeamMember';
import {TeamResponseDto} from "./dto/team-response.dto";
import {UserResponseDto} from "../user/dto/user-response.dto";

export interface ITeamService {

    createTeam(name: string, userId: number): Promise<TeamResponseDto>;

    getAllTeams(): Promise<TeamResponseDto[]>;

    removeTeam(
        teamId: number,
        currentUserId: number
    ): Promise<void>;

    renameTeam(
        teamId: number,
        currentUserId: number,
        name: string
    ): Promise<TeamResponseDto>;

    getUserTeams(
        userId: number,
        page: number,
        limit: number,
        search?: string,
        sort?: string,
        order?: 'asc' | 'desc'
    ): Promise<{
        data: Team[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;

    getUserOwnTeams(
        userId: number,
        page: number,
        limit: number,
        search?: string,
        sort?: string,
        order?: 'asc' | 'desc'
    ): Promise<{
        data: Team[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;

    getUserManageableTeams(
        userId: number,
        page: number,
        limit: number,
        search?: string,
        sort?: string,
        order?: 'asc' | 'desc'
    ): Promise<{
        data: Team[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;

    getUserMemberTeams(
        userId: number,
        page: number,
        limit: number,
        search?: string,
        sort?: string,
        order?: 'asc' | 'desc'
    ): Promise<{
        data: Team[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }>;

    addTeamMember(
        teamId: number,
        currentUserId: number,
        userId: number,
        role: TeamRole
    ): Promise<void>;

    getTeamMembers(
        teamId: number,
        currentUserId: number
    ): Promise<{
        userId: number;
        email: string;
        role: TeamRole;
    }[]>;

    removeMember(
        teamId: number,
        currentUserId: number,
        userId: number
    ): Promise<void>;

    updateMemberRole(
        teamId: number,
        currentUserId: number,
        userId: number,
        role: TeamRole
    ): Promise<void>;

    getMyTeamsSelectList(
        userId: number
    ): Promise<{
        teamId: number;
        name: string;
    }[]>;

    getMyRenameableTeamsSelectList(
        userId: number
    ): Promise<{
        teamId: number;
        name: string;
    }[]>;

    getMyManageableTeamsSelectList(
        userId: number
    ): Promise<{
        teamId: number;
        name: string;
    }[]>;

    getMyOwnedTeamsSelectList(
        userId: number
    ): Promise<{
        teamId: number;
        name: string;
    }[]>;

    getMyTeamsForMemberRemoval(
        userId: number
    ): Promise<{
        teamId: number;
        name: string;
    }[]>;

    getRemovableMembers(
        teamId: number,
        currentUserId: number
    ): Promise<{
        userId: number;
        email: string;
        role: TeamRole;
    }[]>;

    getMyTeamsForRoleUpdate(
        userId: number
    ): Promise<{
        teamId: number;
        name: string;
    }[]>;

    getUpdatableMembers(
        teamId: number,
        currentUserId: number
    ): Promise<{
        userId: number;
        email: string;
        role: TeamRole;
    }[]>;

    getAddableUsers(
        teamId: number,
        currentUserId: number
    ): Promise<{
        userId: number;
        email: string;
    }[]>;

    getMyTeamsForOwnershipTransfer(
        userId: number
    ): Promise<{
        teamId: number;
        name: string;
    }[]>;

    getTransferableMembers(
        teamId: number,
        currentUserId: number
    ): Promise<{
        userId: number;
        email: string;
        role: TeamRole;
    }[]>;

    transferOwnership(
        teamId: number,
        currentUserId: number,
        newOwnerId: number
    ): Promise<void>;

    transferOwnershipAndLeave(
        teamId: number,
        currentUserId: number,
        newOwnerId: number
    ): Promise<void>;

}