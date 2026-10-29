import { Controller, Post, Body, Get, Param, ParseIntPipe } from '@nestjs/common';
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

    @Get()
    findAll(){
        return this.orderService.findAll();
    }

    @Get(':id') 
    findOne(@Param('id', ParseIntPipe) id: number){
        return this.orderService.findOne(id);
    }       
}
