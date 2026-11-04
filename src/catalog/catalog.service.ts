
import { Injectable } from '@nestjs/common';
import ProductService from '../products/product.service';

@Injectable()
export class CatalogService {

    constructor(
        private readonly productService: ProductService
    ) {}

    async getSummary() {

        const products = await this.productService.findAll({});

        const totalProducts = products.length;

        const totalStockUnits = products.reduce(
            (total, product) => total + product.stock,
            0
        );

        return {
            totalProducts,
            totalStockUnits
        };
    }
}
