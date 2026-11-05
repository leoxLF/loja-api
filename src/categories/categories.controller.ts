
import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    UseGuards
} from '@nestjs/common';

import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiResponse
} from '@nestjs/swagger';

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Category } from './category.entity';
import { Product } from '../products/product.entity';

@Controller('categories')
export class CategoriesController {

    constructor(
        private readonly categoriesService: CategoriesService
    ) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Cria uma nova categoria',
        description: 'Cadastra uma categoria. Apenas administradores podem realizar esta operação.'
    })
    @ApiResponse({ status: 201, description: 'Categoria criada com sucesso.', type: Category })
    @ApiResponse({ status: 400, description: 'Dados inválidos.' })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @ApiResponse({ status: 403, description: 'Acesso permitido apenas para ADMIN.' })
    create(@Body() dto: CreateCategoryDto) {
        return this.categoriesService.create(dto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Lista todas as categorias',
        description: 'Retorna todas as categorias cadastradas, incluindo seus produtos.'
    })
    @ApiResponse({ status: 200, description: 'Categorias retornadas com sucesso.', type: [Category] })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    findAll() {
        return this.categoriesService.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Busca uma categoria pelo ID',
        description: 'Retorna uma categoria específica com seus produtos associados.'
    })
    @ApiParam({ name: 'id', description: 'ID da categoria', example: 1, type: Number })
    @ApiResponse({ status: 200, description: 'Categoria encontrada.', type: Category })
    @ApiResponse({ status: 400, description: 'ID inválido.' })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @ApiResponse({ status: 404, description: 'Categoria não encontrada.' })
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.findOne(id);
    }

    @Get(':id/products')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Lista os produtos de uma categoria',
        description: 'Retorna todos os produtos associados à categoria informada.'
    })
    @ApiParam({ name: 'id', description: 'ID da categoria', example: 1, type: Number })
    @ApiResponse({ status: 200, description: 'Produtos da categoria retornados com sucesso.', type: [Product] })
    @ApiResponse({ status: 400, description: 'ID inválido.' })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @ApiResponse({ status: 404, description: 'Categoria não encontrada.' })
    findProductsByCategory(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.findProductsByCategory(id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Atualiza uma categoria',
        description: 'Atualiza os dados de uma categoria cadastrada. Apenas administradores podem realizar esta operação.'
    })
    @ApiParam({ name: 'id', description: 'ID da categoria que deseja atualizar', example: 1, type: Number })
    @ApiResponse({ status: 200, description: 'Categoria atualizada com sucesso.', type: Category })
    @ApiResponse({ status: 400, description: 'Dados inválidos ou ID inválido.' })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @ApiResponse({ status: 403, description: 'Acesso permitido apenas para ADMIN.' })
    @ApiResponse({ status: 404, description: 'Categoria não encontrada.' })
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: CreateCategoryDto
    ) {
        return this.categoriesService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Exclui uma categoria',
        description: 'Remove uma categoria cadastrada. Apenas administradores podem realizar esta operação.'
    })
    @ApiParam({ name: 'id', description: 'ID da categoria que deseja excluir', example: 1, type: Number })
    @ApiResponse({ status: 200, description: 'Categoria excluída com sucesso.' })
    @ApiResponse({ status: 400, description: 'ID inválido.' })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @ApiResponse({ status: 403, description: 'Acesso permitido apenas para ADMIN.' })
    @ApiResponse({ status: 404, description: 'Categoria não encontrada.' })
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.remove(id);
    }
}
