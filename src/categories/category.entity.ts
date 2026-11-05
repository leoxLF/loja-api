import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "../products/product.entity";

export type CategoryType = 'CAMISA' | 'ACTION FIGURE'

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    type: CategoryType;

     @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}