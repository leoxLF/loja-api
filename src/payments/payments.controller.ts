
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    ParseIntPipe,
    Req,
    UseGuards,
    Patch,
    Delete
} from '@nestjs/common';

import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiResponse
} from '@nestjs/swagger';

import { Request } from 'express';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-payment-status.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

interface AuthenticatedRequest extends Request {
    user: {
        userId: number;
        username: string;
        role: string;
    };
}

@Controller()
export class PaymentsController {

    constructor(
        private readonly paymentsService: PaymentsService
    ) { }

    @Get('payments')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Lista os pagamentos',
        description: 'Retorna os pagamentos do usuário autenticado. Administradores podem visualizar todos os pagamentos.'
    })
    @ApiResponse({ status: 200, description: 'Lista de pagamentos retornada com sucesso.' })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    findAll(@Req() req: AuthenticatedRequest) {
        return this.paymentsService.findAll(
            req.user.userId,
            req.user.role
        );
    }

    @Post('orders/:id/payments')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Cria um pagamento para um pedido',
        description: 'Cria um pagamento PENDING para um pedido OPEN. O usuário só pode pagar seus próprios pedidos.'
    })
    @ApiParam({ name: 'id', description: 'ID do pedido', example: 1, type: Number })
    @ApiResponse({ status: 201, description: 'Pagamento criado com sucesso.' })
    @ApiResponse({ status: 400, description: 'Pedido não está OPEN ou já possui pagamento ativo.' })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @ApiResponse({ status: 404, description: 'Pedido não encontrado.' })
    create(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: CreatePaymentDto,
        @Req() req: AuthenticatedRequest
    ) {
        return this.paymentsService.create(
            id,
            dto,
            req.user.userId
        );
    }

    @Patch('payments/:id/status')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Atualiza o status de um pagamento',
        description: 'Permite alterar o status de um pagamento PENDING para PAID ou CANCELLED. Apenas o dono do pedido ou um administrador pode realizar a operação.'
    })
    @ApiParam({ name: 'id', description: 'ID do pagamento', example: 1, type: Number })
    @ApiResponse({ status: 200, description: 'Status do pagamento atualizado com sucesso.' })
    @ApiResponse({ status: 400, description: 'Status inválido ou pagamento não está PENDING.' })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @ApiResponse({ status: 403, description: 'Usuário não tem permissão para atualizar este pagamento.' })
    @ApiResponse({ status: 404, description: 'Pagamento ou pedido não encontrado.' })
    updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdatePaymentStatusDto,
        @Req() req: AuthenticatedRequest
    ) {
        return this.paymentsService.updateStatus(
            id,
            dto,
            req.user.userId,
            req.user.role
        );
    }

    @Delete('payments/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Exclui um pagamento',
        description: 'Remove um pagamento cadastrado. Apenas administradores podem realizar esta operação.'
    })
    @ApiParam({ name: 'id', description: 'ID do pagamento', example: 1, type: Number })
    @ApiResponse({ status: 200, description: 'Pagamento excluído com sucesso.' })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @ApiResponse({ status: 403, description: 'Acesso permitido apenas para ADMIN.' })
    @ApiResponse({ status: 404, description: 'Pagamento não encontrado.' })
    remove(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.paymentsService.remove(id);
    }
}
