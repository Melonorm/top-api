import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from "@nestjs/common";
import { ProductModel } from "./product.model";
import { FindProductDto } from "./dto/find-product.dto";

@Controller('product')
export class ProductController {

  @Post('create')
  async create(@Body() dto: Omit<ProductModel, '_id'>) {  // для создания модели получаем в Body модель продукта со всем полями, кроме поля _id

  };

  @Get(':id')   // ':id' - получаем продукт по его полю id
  async get(@Param('id') id: string) {

  };


  @Delete(':id')
  async delete(@Param('id') id: string) {

  };

  @Patch(':id')
  async patch(@Param('id') id: string, @Body() dto: ProductModel) { // При обновлении продукта нужно, чтобы, кроме id параметра вметод в Body пришла целиком модель продукта, которую нужно изменить

  };

  @HttpCode(200) // 200 - потому что при поиске ничего не создаётся - просто получается список найденных продуктов
  @Post()                 // Post -потому что при поиске нужно передать модель dto для поиска
  async findById(@Body() dto: FindProductDto) {
  };

}
