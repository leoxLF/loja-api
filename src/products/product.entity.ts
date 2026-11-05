import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "../categories/category.entity";

@Entity('products')
export class Product{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({length: 255})
    name: string;
    @Column({type: 'numeric', precision: 10, scale: 2})
    price: number;

    @Column({type: 'int', default: 0})
    stock: number;  

    @Column({type: 'varchar', length: 255, nullable: true})
    imageFilename: string | null;

    @ManyToOne(() => Category, (category) => category.products, {
        nullable: true
    })
    @JoinColumn({ name: 'categoryId' })
    category: Category | null;
}