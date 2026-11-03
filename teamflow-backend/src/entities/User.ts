import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN'
}
@Entity()
export class User {

    @PrimaryGeneratedColumn()
    userId!: number;

    @Column({ unique: true })
    email!: string;

    @Column({ select: false })
    password!: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER
    })
    role!: UserRole;

    @CreateDateColumn()
    createdAt!: Date;
}
