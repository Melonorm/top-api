import { IsNumber, IsString } from "class-validator";

export class FindProductDto {
  @IsString()
  category: string; // поиск продукта осуществляется по его категории (поле category)

  @IsNumber()
  limit: number;    // максимальное кол-во продуктов, которые нужно найти по категории за 1 раз
}
