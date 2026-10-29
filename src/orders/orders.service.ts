import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Order, OrderItem } from './order.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from './create-order.dto';
import { Product } from '../products/product.entity';

@Injectable()
export class OrdersService {

    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        private readonly dataSource: DataSource
    ) {}


    async findAll(){
        return this.orderRepository.find({order: { id: 'DESC'}});
    }

    async findOne(id: number){
        const order = await this.orderRepository.findOne({where: {id}});
        if (!order) throw new NotFoundException(`Pedido ${id} não encontrado`);
        
        return order;
    }


    async create(dto: CreateOrderDto, userId: number | null = null): Promise<Order> {

        
        return this.dataSource.transaction(async (manager) => {

            const order = manager.create(Order, {userId, status: 'OPEN', items: []});

            for (const itemDto of dto.items) {
                const product = await manager.findOne(Product, {where: {id: itemDto.productId}}); 
                if (!product) throw new NotFoundException(`Produto ${itemDto.productId} não encontrado`);

                if (itemDto.quantity > product.stock) throw new BadRequestException(`Estoque insuficiente para o produto ${itemDto.productId}. Quantidade em estoque: ${product.stock}`);

                await manager.decrement(Product, {id: product.id}, 'stock', itemDto.quantity);

                const item = manager.create(OrderItem, {
                    productId: product.id,
                    quantity: itemDto.quantity,
                    unitPrice: product.price
                });
                order.items.push(item);
            }
            return manager.save(order);
        });

}
    async cancel(id: number) {

        return this.dataSource.manager.transaction(async (manager) => {
            const order = await manager.findOne(Order, {where: {id}});
            if (!order) throw new NotFoundException(`Pedido ${id} não encontrado`);
            if (order.status !== 'OPEN') throw new BadRequestException(`Só pedidos OPEN podem ser cancelados. Status atual: ${order.status}`);
            for (const item of order.items) {
                await manager.increment(Product, {id: item.productId}, 'stock', item.quantity);
            }

            order.status = 'CANCELLED';
            return manager.save(order);
        })
    }
}
