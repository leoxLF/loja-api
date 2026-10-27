import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import  ProductService  from './product.service';
import { Product } from './product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductService]
})
export class ProductsModule {}
