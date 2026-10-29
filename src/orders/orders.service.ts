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
        // criar uma order para salvar

        // para cada item do dto,
        // - validar se o produto existe
        // - se não existe, retorna 404
        // - verificar se éxiste quantidade em estoque
        // - se não existe, retorna 400
        // - se tiver tudo ok, decrementa do estoque e salva a order como OPEN 
        
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
}
