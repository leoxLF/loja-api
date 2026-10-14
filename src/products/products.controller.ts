import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';

@Controller('products')
export class ProductsController {

    private products: any[] = [];
    private nextId: number = 1;

     @Post()
    create(@Body() product: any){
        product.id = this.nextId++;
        this.products.push(product);
        return product;
    }

   
    @Get()
    findAll(){
        return this.products;
    } 
     @Get(':id')
    findById(@Param('id') id: number){
        console.log('ID recebido:', id);
        const product = this.products.find(produto => produto.id == id);
        if(!product){
            throw new NotFoundException('produto com o id ' + id + ' não encontrado');
        }else{
            return product;
        }
    }

   
}
