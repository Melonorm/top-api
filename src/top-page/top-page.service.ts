import { Injectable } from '@nestjs/common';
import { ModelType } from "@typegoose/typegoose/lib/types";
import { TopLevelCategory, TopPageModel } from "./top-page.model";
import { InjectModel } from "nestjs-typegoose";
import { CreateTopPageDto } from "./dto/create-top-page.dto";

@Injectable()
export class TopPageService {
  constructor(@InjectModel(TopPageModel) private readonly topPageModel: ModelType<TopPageModel>) {}

  async create(dto: CreateTopPageDto) {
    return this.topPageModel.create(dto);
  }

  async findById(id: string) {
    return this.topPageModel.findById(id).exec();
  }

  async findByAlias(alias: string) {
    return this.topPageModel.findOne({ alias }).exec();  // findOne, потому что поле alias уникальное у TopPageModel (unique: true)
  }

/*    Данные, получаемые таким методом будут несгруппированные. Лучше восполььзоваться следующим методом (через aggregate)
  async findByCategory(firstCategory: TopLevelCategory) {  // find, потому что может найти несколько страниц, подпадающих под одну и ту же категорию
    return this.topPageModel.find({ firstCategory }, { alias: 1, secondCategory: 1, title: 1}).exec();   // второй параметр метода find - список полей, который нужно отобразить (если не нужно отображать весь объект). Указывается имя поля и 1, если поле нужно отобразить
  }
*/

/*
  async findByCategory(firstCategory: TopLevelCategory) {
    return this.topPageModel.aggregate([
      {
        $match: {      // Шаг 1: ищем данные по полю firstCategory
          firstCategory
        }
      },
      {
        $group: {    // Шаг 2: группируем найденные данные по неоторым критериям
          _id: { secondCategory: '$secondCategory' },  // группируем данные по полю secondCategory (это будет id группы)
          pages: { $push: { alias: '$alias', title: '$title' } } // второе поле (pages) будет массив с найденными полями alias и title
        }
      }
    ]).exec();
  }
*/


  async findByCategory(firstCategory: TopLevelCategory) {  // предыдущий метод можно написать с помощью chainable операторов:
    return this.topPageModel
      .aggregate()
      .match({
          firstCategory
        })
      .group({
        _id: { secondCategory: '$secondCategory' },
        pages: { $push: { alias: '$alias', title: '$title' } }
      })
      .exec();
  }


  async findByText(text: string) {   // поиск элемента по тексту заданных в индексе полей.
    return this.topPageModel.find({$text: {$search: text, $caseSensitive: false}}).exec();  // ищем строку ${text}, игнорируя значение кейза
  }

  async deleteById(id: string) {
    return this.topPageModel.findByIdAndDelete(id).exec();
  }

  async updateById(id: string, dto: CreateTopPageDto) {
    return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async getAll() {
    return this.topPageModel.find();
  }
}
