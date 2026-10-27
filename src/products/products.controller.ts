import { Controller, Get, Post, Body, Param, NotFoundException, Put, Delete, HttpCode } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDto } from './dto/product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import ProductService from './product.service';
@Controller('products')
export class ProductsController {

    constructor(private readonly productService: ProductService) {}

    
     @Post()
    create(@Body() createProduct: CreateProductDto): ProductDto {
        return this.productService.create(createProduct);
    }

   @Get()
    findAll(): ProductDto[] {
        return this.productService.findAll();
    }

     @Get(':id')
    findById(@Param('id') id: number): ProductDto {
      return this.productService.findById(id);  
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() updateProduct: UpdateProductDto): ProductDto {
       return this.productService.update(id, updateProduct);
    }

    @Delete(':id')
    @HttpCode(204)
    delete(@Param('id') id: number){ 
       this.productService.delete(id);
    }

}