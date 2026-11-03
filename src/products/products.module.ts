import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import  ProductService  from './product.service';
import { Product } from './product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Category } from '../categories/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category]), AuthModule],
  controllers: [ProductsController],
  providers: [ProductService]
})
export class ProductsModule {}
