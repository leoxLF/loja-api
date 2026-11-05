import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  providers: [CatalogService],
  controllers: [CatalogController]
})
export class CatalogModule {}
