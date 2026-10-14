import { Controller, Get, Post, Body, Param, NotFoundException, Put, Delete, HttpCode } from '@nestjs/common';

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

    @Put(':id')
    update(@Param('id') id: number, @Body() updateProduct: any){
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