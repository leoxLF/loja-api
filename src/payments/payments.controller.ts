import { Controller, Get, Post, Body, Param, ParseIntPipe, Req, UseGuards, Patch, Delete } from '@nestjs/common';
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
    findAll(@Req() req: AuthenticatedRequest) {
        return this.paymentsService.findAll(
            req.user.userId,
            req.user.role
        );
    }

    @Post('orders/:id/payments')
    @UseGuards(JwtAuthGuard)
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
    remove(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.paymentsService.remove(id);
    }
}