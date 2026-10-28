import { Controller, Post, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './create-order.dto';

@Controller('orders')
export class OrdersController {

    constructor(
        private readonly orderService: OrdersService
    ){}

    @Post()
    create(@Body() dto: CreateOrderDto){
        return this.orderService.create(dto, 1);
    }

}
