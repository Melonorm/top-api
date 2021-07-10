import { Injectable } from '@nestjs/common';
import { ModelType } from "@typegoose/typegoose/lib/types";
import { ProductModel } from "./product.model";
import { InjectModel } from "nestjs-typegoose";
import { CreateProductDto } from "./dto/create-product.dto";
import { FindProductDto } from "./dto/find-product.dto";
import { ReviewModel } from "../review/review.model";


@Injectable()
export class ProductService {
  constructor(@InjectModel(ProductModel) private readonly productModel: ModelType<ProductModel>) {}

  async create(dto: CreateProductDto) {
    return this.productModel.create(dto);
  }

  async findById(id: string) {
    return this.productModel.findById(id).exec();
  }

  async deleteById(id: string) {
    return this.productModel.findByIdAndDelete(id).exec();
  }

  async updateById(id: string, dto: CreateProductDto) {
    return this.productModel.findByIdAndUpdate(id, dto, { new: true }).exec();   // new: true - по умолчанию всегда возвращает новый объект (апдейтнутый старый)
  }

  /**
   * Возвращает продукт и review к нему (заданное кол-во)
   * @param dto
   */
  async findWithReviews(dto: FindProductDto) {
    return this.productModel.aggregate([
      {
        $match: {    // 1 шаг. Найти среди всех документов продуктов документы, которые содержат категорию из dto
          categories: dto.category    // сравнивает значение в JSON документа (у модели ProductModel) в БД со значением этого поля у dto (в данном случае проверяет все значения элементов в массиве categories и сравнивает их с полем dto.category)
        }
      },
      {
        $sort: {    // 2 шаг. сделать сортировку стбильной (чтоб выдавала всегда одни и те же значения (по-умолчанию, mongo выдаёт нестбильную сортировку, если испльзуются $limit, $skip и т.д.))
          _id: 1    // сортировка по единому id всегда стабильная
        }
      },
      {
        $limit: dto.limit           // 3 шаг. устанавливает лимит найденных документов
      },
      {
        $lookup: {                  // 4 шаг. Подтягивает данные из таблицы Review к нашим найденным данным
          from: 'Review',           // из какой таблицы подтянуть данные
          localField: '_id',        // обозначение локального поля, которое мы хотим использовать для поиска
          foreignField: 'productId',  // поле таблицы, в которой будем производить поиск
          as: 'reviews',              // задаёт alias для поля, которое будет выведено в результате
        }
      },
      {
        $addFields: {               // 5 шаг добавляет некоторые поля на основании некоторых расчётов или функций (встроенными в монго Operations Pipeline )
          reviewCount: { $size: '$reviews' }, // поле - число review (на основании данных из предыдущего pipeline (см. шаг 4), собранных в поле review). Кол-во review в данном случае - длина массива review. В предыдущем шаге получили новое поле review. В этом шаге ссылаемся на него - ставится знак доллара перед именем поля
          reviewAvg: { $avg: '$reviews.rating' },   // поле - среднее значение рейтинга. Расчёт среднего значения идёт по полю rating модели review
/*
          reviews: {              // перезаписываем уже существующее поле reviews
            $function: {          // оператор внутренней функции в монго:
              body: 'function(reviews) {\n' +                                                 // содержит внутреннюю функцию, принимающую аргументом массив reviews...
                ' reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))\n' +   // ...сортирует элементы массива по их полю createdAt от самого нового до самого старого
                ' return reviews;\n' +                                                         // ...возврщает отсортированный массив reviews
                ' }',
              args: ['reviews'],           // массив аргументов
              lang: 'js'          // язык исполнения (пока поддерживается только js)
            }
          }
*/
        }
      }
    ]).exec() as (ProductModel & { review: ReviewModel[], reviewCount: number, reviewAvg: number })[];   // каст полученных данных к типу - совмещёный ProductModel с массивом ReviewModel и данными - кол-во review и их среднее значение. Возвращается массив этоих сущностей  (!!! РАЗОБРАТЬСЯ В ЭТОМ ПИЗДЕЦЕ !!!)
  }
}
