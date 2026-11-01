import { Controller, Get, Post, Body, Param, NotFoundException, Put, Delete, HttpCode, UseGuards, UploadedFile, ParseIntPipe, BadRequestException, UseInterceptors, Res, Query, Patch } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDto } from './dto/product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import ProductService from './product.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { createReadStream, existsSync } from 'fs';
import type { Response } from 'express';
import { PatchProductDto } from './dto/patch-product.dto';
@Controller('products')
export class ProductsController {

    constructor(private readonly productService: ProductService) { }


    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Create a new product' })
    @ApiResponse({ status: 201, description: 'The product has been successfully created.', type: ProductDto })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    create(@Body() createProduct: CreateProductDto): Promise<ProductDto> {
        return this.productService.create(createProduct);
    }

    @Get()
    findAll(@Query('q') q?: string): Promise<ProductDto[]> {
        return this.productService.findAll(q);
    }

    @Get(':id')
    findById(@Param('id') id: number): Promise<ProductDto> {
        return this.productService.findById(id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: number, @Body() updateProduct: UpdateProductDto): Promise<ProductDto> {
        return this.productService.update(id, updateProduct);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    updatePartial(
        @Param('id', ParseIntPipe) id: number,
        @Body() patchProduct: PatchProductDto
    ): Promise<ProductDto> {
        return this.productService.updatePartial(id, patchProduct);
    }

    @Delete(':id')
    @HttpCode(204)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    delete(@Param('id') id: number): Promise<void> {
        return this.productService.delete(id);
    }

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

    @Get(':id/image')
    async getImage(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        const product = await this.productService.findById(id);
        if (!product || !product.imageFilename) throw new NotFoundException('Imagem não encontrada.');
        const path = join(process.cwd(), 'uploads', product.imageFilename);
        if (!existsSync(path)) throw new NotFoundException('Imagem não encontrada.');
        createReadStream(path).pipe(res);

    }
}