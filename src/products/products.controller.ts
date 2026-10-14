import { Controller, Get, Post, Body, Param, NotFoundException, Put, Delete, HttpCode } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDto } from './dto/product.dto';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {

    private products: ProductDto[] = [];
    private nextId: number = 1;

    
     @Post()
    create(@Body() createProduct: CreateProductDto): ProductDto {
        const{ name, price, stock } = createProduct;
        const product: ProductDto = { id: this.nextId++, name, price, stock };
        this.products.push(product);
        return product;
    }

   @Get()
    findAll(): ProductDto[] {
        return this.products;
    }

     @Get(':id')
    findById(@Param('id') id: number): ProductDto {
        console.log('ID recebido:', id);
        const product = this.products.find(produto => produto.id == id);
        if(!product){
            throw new NotFoundException('produto com o id ' + id + ' não encontrado');
        }else{
            return product;
        }
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() updateProduct: UpdateProductDto): ProductDto {
        const product = this.products.find(produto => produto.id == id);
        if(!product){
            throw new NotFoundException('produto com o id ' + id + ' não encontrado');
        }
        Object.assign(product, updateProduct);
        return product;
    }

    @Delete(':id')
    @HttpCode(204)
    delete(@Param('id') id: number){ 
        // buscar o índice do produto com o id fornecido
        const index = this.products.findIndex(produto => produto.id == id);
        // se não encontrar o produto, lançar uma exceção
        if(index === -1){
            throw new NotFoundException('produto com o id ' + id + ' não encontrado');
        }
        // remover o produto do array
        this.products.splice(index, 1);
    }

}