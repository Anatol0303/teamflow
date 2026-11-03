import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn} from 'typeorm';
import {User} from "./User";

@Entity()
export class Team {

    @PrimaryGeneratedColumn()
    teamId!: number;

    @Column()
    name!: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'createdBy' })
    createdBy!: User;

    @CreateDateColumn()
    createdAt!: Date;
}
