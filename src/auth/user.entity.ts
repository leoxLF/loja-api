import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "../orders/order.entity";

export type Role = 'ADMIN' | 'CLIENT';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: 'CLIENT' })
    role: Role;

    @Column({ type: 'varchar', nullable: true, select: false })
    refreshTokenHash: string | null;

}