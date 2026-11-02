import { Controller, Post, Body, Get, Param, ParseIntPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './create-order.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('orders')
export class OrdersController {

    constructor(
        private readonly orderService: OrdersService
    ) { }

    @ApiOperation({ summary: 'Cria um pedido', description: 'Cria um novo pedido utilizando os produtos e quantidades informados. O estoque dos produtos é atualizado automaticamente.' })
    @ApiResponse({ status: 201, description: 'Pedido criado com sucesso.' })
    @ApiResponse({ status: 400, description: 'Dados inválidos ou estoque insuficiente.' })
    @ApiResponse({ status: 404, description: 'Um ou mais produtos informados não foram encontrados.' })
    @Post()
    create(@Body() dto: CreateOrderDto) {
        return this.orderService.create(dto, 1);
    }

    @ApiOperation({ summary: 'Lista todos os pedidos', description: 'Retorna todos os pedidos cadastrados no sistema, ordenados pelo ID em ordem decrescente.' })
    @ApiResponse({ status: 200, description: 'Lista de pedidos retornada com sucesso.' })
    @Get()
    findAll() {
        return this.orderService.findAll();
    }

    @ApiOperation({ summary: 'Retorna um pedido pelo ID', description: 'Busca os detalhes de um pedido cadastrado utilizando seu ID.' })
    @ApiParam({ name: 'id', description: 'ID do pedido que deseja consultar', example: 1, type: Number })
    @ApiResponse({ status: 200, description: 'Pedido retornado com sucesso.' })
    @ApiResponse({ status: 400, description: 'ID inválido.' })
    @ApiResponse({ status: 404, description: 'Pedido não encontrado.' })
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.orderService.findOne(id);
    }

    @ApiOperation({ summary: 'Cancela um pedido', description: 'Cancela um pedido com status OPEN e devolve ao estoque as quantidades dos produtos associados.' })
    @ApiParam({ name: 'id', description: 'ID do pedido que deseja cancelar', example: 1, type: Number })
    @ApiResponse({ status: 201, description: 'Pedido cancelado com sucesso.' })
    @ApiResponse({ status: 400, description: 'ID inválido ou pedido não está com status OPEN.' })
    @ApiResponse({ status: 404, description: 'Pedido não encontrado.' })
    @Post(':id/cancel')
    cancel(@Param('id', ParseIntPipe) id: number) {
        return this.orderService.cancel(id);
    }
}
