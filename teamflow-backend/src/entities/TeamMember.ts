import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from 'typeorm';
import {User} from './User';
import { Team } from './Team';

export enum TeamRole {
    OWNER ='OWNER',
    MANAGER = 'MANAGER',
    MEMBER = 'MEMBER'
}

@Entity()
export class TeamMember {

    @PrimaryGeneratedColumn()
    teamMemberId!: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user!: User;

    @ManyToOne(() => Team)
    @JoinColumn({ name: 'teamId' })
    team!: Team;

    @Column({
        type: 'enum',
        enum: TeamRole
    })
    role!: TeamRole;
}