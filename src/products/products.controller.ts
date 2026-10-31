import { Controller, Get, Post, Body, Param, NotFoundException, Put, Delete, HttpCode, UseGuards } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDto } from './dto/product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import ProductService from './product.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@Controller('products')
export class ProductsController {

    constructor(private readonly productService: ProductService) {}

    
     @Post()
     @UseGuards(JwtAuthGuard)
    create(@Body() createProduct: CreateProductDto): Promise<ProductDto> {
        return this.productService.create(createProduct);
    }

   @Get()
    findAll(): Promise<ProductDto[]> {
        return this.productService.findAll();
    }

     @Get(':id')
    findById(@Param('id') id: number): Promise<ProductDto> {
      return  this.productService.findById(id);  
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    update(@Param('id') id: number, @Body() updateProduct: UpdateProductDto): Promise<ProductDto> {
       return this.productService.update(id, updateProduct);
    }

    @Delete(':id')
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    delete(@Param('id') id: number): Promise<void>  { 
       return this.productService.delete(id);
    }

}