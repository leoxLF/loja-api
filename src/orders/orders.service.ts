import { Injectable } from '@nestjs/common';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from './create-order.dto';

@Injectable()
export class OrdersService {

    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
    ) {}

    async create(dto: CreateOrderDto, userId: number | null = null): Promise<Order> {
        // criar uma order para salvar

        // para cada item do dto,
        // - validar se o produto existe
        // - se não existe, retorna 404
        // - verificar se éxiste quantidade em estoque
        // - se não existe, retorna 400
        // - se tiver tudo ok, decrementa do estoque e salva a order como OPEN 
        
        return

}
