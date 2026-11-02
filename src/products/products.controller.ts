import { Controller, Get, Post, Body, Param, NotFoundException, Put, Delete, HttpCode, UseGuards, UploadedFile, ParseIntPipe, BadRequestException, UseInterceptors, Res, Query, Patch } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDto } from './dto/product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import ProductService from './product.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { createReadStream, existsSync } from 'fs';
import type { Response } from 'express';
import { PatchProductDto } from './dto/patch-product.dto';
import { ListProductsQueryDto } from './dto/list-products-query.dto';
@Controller('products')
export class ProductsController {

    constructor(private readonly productService: ProductService) { }


    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new product' })
    @ApiResponse({ status: 201, description: 'O produto foi criado com sucesso.', type: ProductDto })
    @ApiResponse({ status: 401, description: 'Não autorizado.' })
    @ApiResponse({ status: 403, description: 'Acesso proibido.' })
    create(@Body() createProduct: CreateProductDto): Promise<ProductDto> {
        return this.productService.create(createProduct);
    }

    @ApiOperation({ summary: 'Retorna todos os produtos' })
    @ApiResponse({ status: 200, description: 'Lista de produtos retornada com sucesso.', type: [ProductDto] })
    @ApiResponse({ status: 404, description: 'Nenhum produto encontrado.' })
    @Get()
    findAll(@Query() query: ListProductsQueryDto): Promise<ProductDto[]> {
        return this.productService.findAll(query);
    }

    @ApiOperation({ summary: 'Retorna um produto pelo ID', description: 'Retorna um produto específico com base no ID fornecido.' })
    @ApiResponse({ status: 200, description: 'Produto retornado com sucesso.', type: ProductDto })
    @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
    @ApiResponse({ status: 400, description: 'ID inválido. O ID deve ser um número inteiro.' })
    @ApiParam({ name: 'id', description: 'ID do produto que deseja consultar', example: 1, type: Number })
    @Get(':id')
    findById(@Param('id', ParseIntPipe) id: number): Promise<ProductDto> {
        return this.productService.findById(id);
    }

    @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso.', type: ProductDto })
    @ApiResponse({ status: 400, description: 'Dados inválidos ou ID inválido.' })
    @ApiResponse({ status: 401, description: 'Não autorizado. É necessário realizar autenticação.' })
    @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
    @ApiParam({ name: 'id', description: 'ID do produto que deseja atualizar', example: 1, type: Number })
    @Put(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: number, @Body() updateProduct: UpdateProductDto): Promise<ProductDto> {
        return this.productService.update(id, updateProduct);
    }

    @ApiOperation({ summary: 'Atualiza parcialmente um produto', description: 'Atualiza um ou mais campos de um produto cadastrado utilizando seu ID, sem exigir o envio de todos os dados.' })
    @ApiParam({ name: 'id', description: 'ID do produto que deseja atualizar', example: 1, type: Number })
    @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso.', type: ProductDto })
    @ApiResponse({ status: 400, description: 'Dados inválidos ou ID inválido.' })
    @ApiResponse({ status: 401, description: 'Não autorizado. É necessário realizar autenticação.' })
    @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    updatePartial(
        @Param('id', ParseIntPipe) id: number,
        @Body() patchProduct: PatchProductDto
    ): Promise<ProductDto> {
        return this.productService.updatePartial(id, patchProduct);
    }
    @ApiOperation({ summary: 'Exclui um produto pelo ID', description: 'Exclui um produto específico com base no ID fornecido. Apenas administradores podem realizar esta ação.' })
    @ApiParam({ name: 'id', description: 'ID do produto que deseja excluir', example: 1, type: Number })
    @ApiResponse({ status: 204, description: 'Produto excluído com sucesso.' })
    @ApiResponse({ status: 401, description: 'Não autorizado. É necessário realizar autenticação.' })
    @ApiResponse({ status: 403, description: 'Acesso negado. Apenas administradores podem excluir produtos.' })
    @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
    @ApiResponse({ status: 500, description: 'Erro interno do servidor.' })
    @Delete(':id')
    @HttpCode(204)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    delete(@Param('id') id: number): Promise<void> {
        return this.productService.delete(id);
    }

    @ApiOperation({ summary: 'Envia uma imagem para um produto', description: 'Realiza o upload de uma imagem JPEG, PNG ou WEBP de até 2 MB. Disponível apenas para administradores.' })
    @ApiParam({ name: 'id', description: 'ID do produto que receberá a imagem', example: 1, type: Number })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary', description: 'Imagem JPEG, PNG ou WEBP (máximo de 2 MB)' } }, required: ['file'] } })
    @ApiResponse({ status: 201, description: 'Imagem enviada e associada ao produto com sucesso.' })
    @ApiResponse({ status: 400, description: 'Arquivo ausente, formato inválido ou ID inválido.' })
    @ApiResponse({ status: 401, description: 'Não autorizado. É necessário realizar autenticação.' })
    @ApiResponse({ status: 403, description: 'Acesso negado. Apenas administradores podem enviar imagens.' })
    @ApiResponse({ status: 404, description: 'Produto não encontrado.' })
    @ApiResponse({ status: 413, description: 'Arquivo enviado excede o limite de 2 MB.' })
    @Post(':id/image')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: './uploads',
                filename: (_req, file, callback) => {
                    const safe = file.originalname.replace(/\s+/g, '_');
                    callback(null, `${Date.now()}-${safe}`);
                }
            }),
            limits: { fileSize: 2 * 1024 * 1024 },
            fileFilter: (_req, file, callback) => {
                const ok = ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype);
                if (!ok) return callback(null, false);
                callback(null, true);
            }
        }))
    async uploadImage(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFile() file: Express.Multer.File
    ) {
        if (!file) throw new BadRequestException('Envie o campo file jpeg/png/webp');
        await this.productService.updateImageFilename(id, file.filename);
        return { productId: id, imageUrl: `/products/${id}/image` }
    }


    @ApiOperation({ summary: 'Retorna a imagem de um produto', description: 'Busca e exibe a imagem associada ao produto utilizando seu ID.' })
    @ApiParam({ name: 'id', description: 'ID do produto cuja imagem deseja visualizar', example: 1, type: Number })
    @ApiResponse({ status: 200, description: 'Imagem retornada com sucesso.' })
    @ApiResponse({ status: 400, description: 'ID inválido.' })
    @ApiResponse({ status: 404, description: 'Produto ou imagem não encontrado.' })
    @Get(':id/image')
    async getImage(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const product = await this.productService.findById(id);
        if (!product || !product.imageFilename) throw new NotFoundException('Imagem não encontrada.');
        const path = join(process.cwd(), 'uploads', product.imageFilename);
        if (!existsSync(path)) throw new NotFoundException('Imagem não encontrada.');
        createReadStream(path).pipe(res);

    }
}