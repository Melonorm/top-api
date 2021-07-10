import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UsePipes, ValidationPipe
} from "@nestjs/common";
import { ProductModel } from "./product.model";
import { FindProductDto } from "./dto/find-product.dto";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { PRODUCT_NOT_FOUND_ERROR } from "./product.constans";
import { IdValidationPipe } from "../pipes/id-validation.pipe";

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {
  }

/*
  @Post('create')
  async create(@Body() dto: Omit<ProductModel, '_id'>) {  // для создания модели получаем в Body модель продукта со всем полями, кроме поля _id

  };
*/
  @Post('create')
  async create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  };


  @Get(':id')   // ':id' - получаем продукт по его полю id
  async get(@Param('id', IdValidationPipe) id: string) {   // IdValidationPipe - валидируем параметр id кастомным пайпом
    const product = await this.productService.findById(id);
    if (!product) {
      throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
    }
    return product;
  };


  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedProduct = await this.productService.deleteById(id);
    if (!deletedProduct) {
      throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR);
    }
  };

  @Patch(':id')
  async patch(@Param('id', IdValidationPipe) id: string, @Body() dto: ProductModel) { // При обновлении продукта нужно, чтобы, кроме id параметра вметод в Body пришла целиком модель продукта, которую нужно изменить
    const updatedProduct = await this.productService.updateById(id, dto);
    if (!updatedProduct) {
      throw new NotFoundException(PRODUCT_NOT_FOUND_ERROR)
    }
    return updatedProduct;
  };

  @UsePipes(new ValidationPipe())
  @HttpCode(200) // 200 - потому что при поиске ничего не создаётся - просто получается список найденных продуктов
  @Post('find')                 // Post - потому что при поиске нужно передать модель dto для поиска
  async findById(@Body() dto: FindProductDto) {
    return this.productService.findWithReviews(dto);
  };
}
