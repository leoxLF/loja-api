import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { Between, ILike, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import path from 'path/win32';
import * as fs from 'fs/promises';
import { PatchProductDto } from './dto/patch-product.dto';
import { ListProductsQueryDto } from './dto/list-products-query.dto';

@Injectable()
export default class ProductService {

    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>
    ) { }

    async findAll(query: ListProductsQueryDto): Promise<Product[]> {
        const where: any = {};

        if (query.q) {
            where.name = ILike(`%${query.q}%`);
        }

        if (query.minPrice !== undefined && query.maxPrice !== undefined) {
            where.price = Between(query.minPrice, query.maxPrice);
        } else if (query.minPrice !== undefined) {
            where.price = MoreThanOrEqual(query.minPrice);
        } else if (query.maxPrice !== undefined) {
            where.price = LessThanOrEqual(query.maxPrice);
        }

        return this.productRepository.find({ where });
    }

    async findById(id: number): Promise<Product> {
        let product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new NotFoundException('produto com o id ' + id + ' não encontrado');
        }
        return product;


    }
    async update(id: number, updateProduct: UpdateProductDto): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new NotFoundException('produto com o id ' + id + ' não encontrado');
        }
        Object.assign(product, updateProduct);

        return this.productRepository.save(product);
    }

    async updatePartial(id: number, patchProduct: PatchProductDto): Promise<Product> {

        const product = await this.productRepository.findOne({ where: { id } });

        if (!product) {
            throw new NotFoundException('produto com o id ' + id + ' não encontrado');
        }

        Object.assign(product, patchProduct);

        return this.productRepository.save(product);
    }

    async delete(id: number): Promise<void> {

        const product = await this.productRepository.findOne({ where: { id } });

        if (product === null) {
            throw new NotFoundException('Produto não encontrado');
        }
        if (product.imageFilename) {
            const imagePath = path.join(
                process.cwd(),
                'uploads',
                product.imageFilename
            );

            try {
                await fs.unlink(imagePath);
            } catch (error) {
                if ((error as NodeJS.ErrnoException).code !== 'Arquivo não encontrado') {
                    throw error;
                }

            }
        }

        const result = await this.productRepository.delete(id);
        if (!result.affected) throw new NotFoundException('produto com o id ' + id + ' não encontrado');

    }

    async create(createProduct: CreateProductDto): Promise<Product> {
        const product = this.productRepository.create(createProduct);
        return this.productRepository.save(product);
    }

    async updateImageFilename(id: number, filename: string) {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) throw new NotFoundException('produto com o id ' + id + ' não encontrado');
        product.imageFilename = filename;
        return this.productRepository.save(product);
    }
}