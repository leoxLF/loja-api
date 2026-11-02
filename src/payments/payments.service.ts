

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Payment } from './payment.entity';
import { Order } from '../orders/order.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class PaymentsService {

    constructor(
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,

        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>
    ) { }

    async create(
        orderId: number,
        dto: CreatePaymentDto,
        userId: number
    ): Promise<Payment> {

        const order = await this.orderRepository.findOne({
            where: {
                id: orderId,
                userId
            }
        });

        if (!order) {
            throw new NotFoundException('Pedido não encontrado');
        }

        if (order.status !== 'OPEN') {
            throw new BadRequestException('Só é possível pagar pedidos OPEN');
        }

        const existingPayment = await this.paymentRepository
            .createQueryBuilder('payment')
            .where('payment.orderId = :orderId', { orderId })
            .andWhere('payment.status IN (:...statuses)', {
                statuses: ['PENDING', 'PAID']
            })
            .getOne();

        if (existingPayment) {
            throw new BadRequestException('Este pedido já possui um pagamento ativo (PENDING ou PAID)');
        }

        const payment = this.paymentRepository.create({
            orderId,
            method: dto.method,
            status: 'PENDING'
        });

        return this.paymentRepository.save(payment);
    }

    async findAll(userId: number, role: string) {
        const query = this.paymentRepository
            .createQueryBuilder('payment')
            .innerJoin('orders', 'order', 'order.id = payment.orderId');

        if (role !== 'ADMIN') {
            query.where('order.userId = :userId', { userId });
        }

        return query.getMany();
    }

    async updateStatus(
    id: number,
    dto: UpdatePaymentStatusDto,
    userId: number,
    role: string
): Promise<Payment> {

    const payment = await this.paymentRepository.findOne({
        where: { id }
    });

    if (!payment) {
        throw new NotFoundException('Pagamento não encontrado');
    }

    const order = await this.orderRepository.findOne({
        where: {
            id: payment.orderId
        }
    });

    if (!order) {
        throw new NotFoundException('Pedido não encontrado');
    }

    if (order.userId !== userId && role !== 'ADMIN') {
        throw new ForbiddenException(
            'Você não tem permissão para atualizar este pagamento'
        );
    }

    if (payment.status !== 'PENDING') {
        throw new BadRequestException(
            'Somente pagamentos PENDING podem ser alterados'
        );
    }

    payment.status = dto.status;

    if (dto.status === 'PAID') {
        order.status = 'PAID';
        await this.orderRepository.save(order);
    }

    return this.paymentRepository.save(payment);
}

    async remove(id: number): Promise<void> {
        const payment = await this.paymentRepository.findOne({
            where: { id }
        });

        if (!payment) {
            throw new NotFoundException('Pagamento não encontrado');
        }

        await this.paymentRepository.remove(payment);
    }
}