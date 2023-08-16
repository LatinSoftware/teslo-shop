import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product_image.entity";

@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text', {
        unique: true
    })
    title: string

    @Column('float', {
        default: 0
    })
    price: number

    @Column({
        type: 'text',
        nullable: true
    })
    description: string

    @Column('text', {
        unique: true
    })
    slug: string

    @Column('int', {
        default: 0
    })
    stock: number

    @Column('text', {
        array: true
    })
    sizes: string[]

    @Column('text')
    gender: string

    @OneToMany(() => ProductImage,
        (image) => image.product,
        { cascade: true, eager: true, onDelete: 'CASCADE' })
    images: ProductImage[]

    @BeforeInsert()
    CheckSlugInsert() {
        this.title.trimEnd().trimStart()
        this.slug = this.title.toLowerCase().replaceAll(' ', '_').replaceAll("'", '')
    }

    @BeforeUpdate()
    CheckSlugUpdate() {
        this.title.trimEnd().trimStart()
        this.slug = this.title.toLowerCase().replaceAll(' ', '_').replaceAll("'", '')
    }
}
