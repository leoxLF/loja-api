import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn
} from 'typeorm';

export type PaymentMethod = 'CARD' | 'BOLETO' | 'PIX';

export type PaymentStatus = 'PENDING' | 'PAID' | 'CANCELLED';

@Entity('payments')
export class Payment {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    orderId: number;

    @Column({ type: 'varchar', length: 20 })
    method: PaymentMethod;

    @Column({ type: 'varchar', length: 20, default: 'PENDING' })
    status: PaymentStatus;

    @CreateDateColumn()
    createdAt: Date;
}