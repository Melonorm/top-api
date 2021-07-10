import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class ProductCharacteristicDto{
  @IsString()
  name: string;

  @IsString()
  value: string;
}

export class CreateProductDto {
  @IsString()
  image: string;

  @IsString()
  title: string;

  @IsNumber()
  price: number;

  @IsOptional()    // сигнализирует валидатору, что это поле опционально (его может и не быть)
  @IsNumber()
  oldPrice?: number;

  @IsNumber()
  credit: number;

  @IsString()
  description: string;

  @IsString()
  advantages: string;

  @IsString()
  disAdvantages: string;

  @IsArray()                               // @IsArray() - проверяет, являются ли входящие данные массивом
  @IsString({each: true})    // each: true - проверяет, что каждый элемент массива - это строка
  categories: string[];

  @IsArray()
  @IsString({each: true})
  tags: string[];

  @IsArray()
  @ValidateNested()                        // @ValidateNested() - используется, если тип поля является влоденным классом. Сигнализирует о том, что нужно зайти внутрь влоденного класса и провалидировать каждое его поле
  @Type(() => ProductCharacteristicDto)    //  @Type() - валидирует поле на заданный класс (ProductCharacteristicDto в данном случае)
  characteristics: ProductCharacteristicDto[];
}
