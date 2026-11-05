import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Product } from '../products/product.entity';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>
    ) {}

    async create(dto: CreateCategoryDto): Promise<Category> {
        const category = this.categoryRepository.create({
            type: dto.type
        });

        return this.categoryRepository.save(category);
    }

    async findAll(): Promise<Category[]> {
        return this.categoryRepository.find({
            relations: {
                products: true
            }
        });
    }

    async findOne(id: number): Promise<Category> {
        const category = await this.categoryRepository.findOne({
            where: { id },
            relations: {
                products: true
            }
        });

        if (!category) {
            throw new NotFoundException('Categoria não encontrada');
        }

        return category;
    }

    async update(id: number, dto: CreateCategoryDto): Promise<Category> {
        const category = await this.findOne(id);

        category.type = dto.type;

        return this.categoryRepository.save(category);
    }

    async remove(id: number): Promise<void> {
        const category = await this.findOne(id);

        await this.categoryRepository.remove(category);
    }

    async findProductsByCategory(id: number): Promise<Product[]> {
    const category = await this.findOne(id);

    return category.products;
}
}