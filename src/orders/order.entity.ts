import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./order-item.entity";

export type OrderStatus = 'OPEN' | 'PAID' | 'CANCELLED'

@Entity('orders')
export class Order{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'int'})
    userId: number;

    @Column({type: 'varchar', length: 20, default: 'OPEN'})
    status: OrderStatus;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => OrderItem, (item) => item.order, {cascade: true, eager: true})
    items: OrderItem[];
}