import {Controller,Post,Body,Get,Param, ParseIntPipe,Patch,Req, UseGuards} from '@nestjs/common';

import { OrdersService } from './orders.service';
import { CreateOrderDto } from './create-order.dto';
import { SetOrderAddressDto } from './set-order-address.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
    user: {
        userId: number;
        username: string;
        role: string;
    };
}

@Controller('orders')
export class OrdersController {

    constructor(
        private readonly orderService: OrdersService
    ) { }

    @ApiOperation({ summary: 'Cria um pedido' })
    @ApiResponse({ status: 201, description: 'Pedido criado com sucesso.' })
    @Post()
    @UseGuards(JwtAuthGuard)
    create(
        @Body() dto: CreateOrderDto,
        @Req() req: AuthenticatedRequest
    ) {
        return this.orderService.create(dto, req.user.userId);
    }

    @ApiOperation({ summary: 'Lista todos os pedidos' })
    @ApiResponse({ status: 200, description: 'Lista de pedidos retornada com sucesso.' })
    @Get()
    findAll() {
        return this.orderService.findAll();
    }

    @ApiOperation({ summary: 'Retorna um pedido pelo ID' })
    @ApiParam({ name: 'id', description: 'ID do pedido', example: 1 })
    @ApiResponse({ status: 200, description: 'Pedido retornado com sucesso.' })
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.orderService.findOne(id);
    }

    @ApiOperation({ summary: 'Cancela um pedido' })
    @ApiParam({ name: 'id', description: 'ID do pedido', example: 1 })
    @ApiResponse({ status: 201, description: 'Pedido cancelado com sucesso.' })
    @Post(':id/cancel')
    cancel(@Param('id', ParseIntPipe) id: number) {
        return this.orderService.cancel(id);
    }

    @Patch(':id/address')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Associa um endereço ao pedido' })
    @ApiParam({ name: 'id', description: 'ID do pedido', example: 1 })
    @ApiResponse({ status: 200, description: 'Endereço associado ao pedido.' })
    @ApiResponse({ status: 404, description: 'Pedido ou endereço não encontrado.' })
    setAddress(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: SetOrderAddressDto,
        @Req() req: AuthenticatedRequest
    ) {
        return this.orderService.setAddress(
            id,
            dto.addressId,
            req.user.userId
        );
    }
}