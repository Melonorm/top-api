import { TimeStamps, Base } from "@typegoose/typegoose/lib/defaultClasses";
import { prop } from "@typegoose/typegoose";

class ProductCharacteristic{
  @prop()            // все поля влоденного класса тоже декорируются prop()
  name: string;

  @prop()
  value: string;
}


export interface ProductModel extends Base {}
export class ProductModel extends TimeStamps{
//  _id: string;   // _ перед именем поля - поле приватное
  @prop()
  image: string;

  @prop()
  title: string;

  @prop()
  price: number;

  @prop()
  oldPrice: number;

  @prop()
  credit: number;

  @prop()
  calculatedRating: number;

  @prop()
  description: string;

  @prop()
  advantages: string;

  @prop()
  disAdvantages: string;

  @prop({ type: () => [String] })   // Явное обозначение типа поля декоратору. Говорит о том, что поле должно возвращать массив строк. String с большой буквы - т.к. возвращает тип строки из библиотеки typegoose.
  categories: string[];

  @prop({ type: () => [String] })
  tags: string[];

  @prop({ type: () => [ProductCharacteristic], _id: false})   // _id: false - отключает индексирование элементов массива (по умолчанию, монго жобавляет в поля-массивы индексы)
  characteristics: ProductCharacteristic[];

  // characteristics: {
  //   [key: string]: string  // мапа. ключ - строка, значение - строка
  // };

}



