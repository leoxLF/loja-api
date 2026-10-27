import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export default class ProductService {

    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>
    ) {}

    async findAll(): Promise<Product[]> {
        return this.productRepository.find();
    }

    async findById(id: number): Promise<Product> {
        let product = await this.productRepository.findOne({ where: { id }});
        if(!product){
            throw new NotFoundException('produto com o id ' + id + ' não encontrado');
        }
        return product;
    

        }
     async update( id: number, updateProduct: UpdateProductDto): Promise<Product> {
            const product = await this.productRepository.findOne({ where: { id } });
            if(!product){
                throw new NotFoundException('produto com o id ' + id + ' não encontrado');
            }
            Object.assign(product, updateProduct);

            return this.productRepository.save(product);
        }

    async delete( id: number): Promise<void> {      
        const result = await this.productRepository.delete(id);
            if(!result.affected){
                throw new NotFoundException('produto com o id ' + id + ' não encontrado');
            }
        }

    async create(createProduct: CreateProductDto): Promise<Product> {
            const{ name, price, stock } = createProduct;
            const product = this.productRepository.create({ name, price, stock });
            return this.productRepository.save(product);
        }

}
