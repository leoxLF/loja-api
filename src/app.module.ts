import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import ProductService  from './products/product.service';

@Module({
  imports: [ProductsModule],
  controllers: [AppController],
  providers: [AppService, ProductService],
})
export class AppModule {}
