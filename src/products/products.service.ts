import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { validate } from 'uuid';
import { ProductImage } from './entities/product_image.entity';


@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService')
  constructor
    (
      @InjectRepository(Product)
      private readonly productRepository: Repository<Product>,
      @InjectRepository(ProductImage)
      private readonly productImageRepository: Repository<ProductImage>,

    ) { }

  async create(createProductDto: CreateProductDto) {

    try {
      const { images = [], ...productDetails } = createProductDto
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({ image }))
      })

      await this.productRepository.save(product)

      return {
        ...product,
        images: images
      }

    } catch (error) {
      this.handleExceptions(error)
    }


  }

  async findAll(pagination: PaginationDto) {

    const { offset = 0, limit = 10 } = pagination

    var products = await this.productRepository.find({
      skip: offset,
      take: limit
    });

    return products.map(product => ({
      ...product,
      images: product.images.map(x => x.image)
    }))
  }

  async findOne(query: string) {

    let product: Product

    if (validate(query))
      product = await this.productRepository.findOneBy({ id: query })
    else {

      product = await this.productRepository.createQueryBuilder("product")
        .where("product.slug = :slug", { slug: query })
        .orWhere("product.title = :title", { title: query }).getOne()

    }

    // var product = await this.productRepository.findOneBy({ id: query }, {});

    if (product == null) throw new NotFoundException("Producto no encontrado")

    return product
  }

  async findOneRel(query: string) {

    let product: Product

    if (validate(query))
      product = await this.productRepository.findOne({
        where: {
          id: query
        },
        relations: {
          images: true
        }
      })
    else {

      product = await this.productRepository.createQueryBuilder("product")
        .where("product.slug = :slug", { slug: query })
        .orWhere("product.title = :title", { title: query })
        .leftJoinAndSelect("product.images", "images")
        .getOne()

    }

    // var product = await this.productRepository.findOneBy({ id: query }, {});

    if (product == null) throw new NotFoundException("Producto no encontrado")

    return {
      ...product,
      images: product.images.map(img => img.image)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    try {

      const { images = [], ...productDetails } = updateProductDto

      const product = await this.productRepository.preload({
        id,
        ...productDetails
      })

      product.images = images.map(image => this.productImageRepository.create({ image }))
      // await this.productRepository.update(id, productToUpdate)

      return productDetails;

    } catch (error) {
      this.handleExceptions(error)
    }

  }

  async remove(id: string) {

    var product = await this.findOne(id)
    await this.productRepository.remove(product)
    // var product = await this.productRepository.delete({ id: id })
    // if (product.affected == 0)
    //   throw new NotFoundException("Producto no encontrado");
  }

  private handleExceptions(error: any) {

    if (error.code == '23505')
      throw new BadRequestException(error.detail)

    this.logger.error(error)
    throw new InternalServerErrorException('Unespedted error, pls check logs')

  }

}
