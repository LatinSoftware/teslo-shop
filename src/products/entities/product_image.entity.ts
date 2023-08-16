import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class ProductImage {

    @PrimaryGeneratedColumn('identity')
    id: number

    @Column('text')
    image: string


    @ManyToOne(() => Product, (product) => product.images)
    product: Product

}

