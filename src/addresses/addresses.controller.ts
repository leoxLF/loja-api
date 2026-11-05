import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Req,
    UseGuards
} from '@nestjs/common';

import { AddressesService } from './addresses.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
    user: {
        userId: number;
        username: string;
        role: string;
    };
}

@Controller('addresses')
export class AddressesController {
    constructor(
        private readonly addressesService: AddressesService
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Cadastra um endereço para o usuário autenticado' })
    @ApiResponse({ status: 201, description: 'Endereço cadastrado com sucesso.' })
    create(
        @Body() dto: CreateAddressDto,
        @Req() req: AuthenticatedRequest
    ) {
        return this.addressesService.create(dto, req.user.userId);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Lista os endereços do usuário autenticado' })
    @ApiResponse({ status: 200, description: 'Endereços retornados com sucesso.' })
    findAll(@Req() req: AuthenticatedRequest) {
        return this.addressesService.findAll(req.user.userId);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Busca um endereço pelo ID' })
    @ApiParam({ name: 'id', example: 1, description: 'ID do endereço' })
    @ApiResponse({ status: 200, description: 'Endereço encontrado.' })
    @ApiResponse({ status: 404, description: 'Endereço não encontrado.' })
    findOne(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: AuthenticatedRequest
    ) {
        return this.addressesService.findOne(id, req.user.userId);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Atualiza um endereço' })
    @ApiParam({ name: 'id', example: 1, description: 'ID do endereço' })
    @ApiResponse({ status: 200, description: 'Endereço atualizado com sucesso.' })
    @ApiResponse({ status: 404, description: 'Endereço não encontrado.' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateAddressDto,
        @Req() req: AuthenticatedRequest
    ) {
        return this.addressesService.update(id, dto, req.user.userId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(204)
    @ApiOperation({ summary: 'Exclui um endereço' })
    @ApiParam({ name: 'id', example: 1, description: 'ID do endereço' })
    @ApiResponse({ status: 204, description: 'Endereço excluído com sucesso.' })
    @ApiResponse({ status: 404, description: 'Endereço não encontrado.' })
    remove(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: AuthenticatedRequest
    ) {
        return this.addressesService.remove(id, req.user.userId);
    }
}