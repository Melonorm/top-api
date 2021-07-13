import { index, prop } from "@typegoose/typegoose";
import { TimeStamps, Base } from "@typegoose/typegoose/lib/defaultClasses";

export enum TopLevelCategory {
  Courses,
  Services,
  Books,
  Products
}

export class HHData {
  @prop()
  count: number;

  @prop()
  juniorSalary: number;

  @prop()
  middleSalary: number;

  @prop()
  seniorSalary: number;
}

export class TopPageAdvantage {
  @prop()
  title: string;

  @prop()
  description: string;
}

export interface TopPageModel extends Base {}
/*                                         ВНИМАНИЕ!!! В этом случае не ищет в полях-массивах!!!
@index({title: 'text', seoText: 'text'}) // для реализации поиска по нескольким полям БД. Передаются имена полей. В значения передаются либо "text" для текстового индекса, либо 1 для общего индекса.
*/
@index({"$**": 'text'}) // с данноц wildCard ("$**") ищет по всем полям класса, В ТОМ ЧИСЛЕ И ВНУТРИ МАССИВОВ
export class TopPageModel extends TimeStamps {

  @prop({enum: TopLevelCategory})    // сообщает декоратору, что поле - enum
  firstCategory: TopLevelCategory;

  @prop()
  secondCategory: string;

  @prop({unique: true})   // alias должен быть уникальным, чтобы потом можно было получать объект по его значению alias
  alias: string

  @prop(/*{text: true}*/)  // если нужен индекс текста (для поиска) по одному полю, используем в props поле text. Если нужен поиск по нескольким полям - используем декоратор index над классом
  title: string;

  @prop()
  category: string;

  @prop({type: HHData})
  hh?: HHData // "?" - поле необязательное. Специфическое только для курсов (firstCategory == Courses)

  @prop({type: () => [TopPageAdvantage]})
  advantages: TopPageAdvantage[];

  @prop()
  seoText: string;

  @prop()
  tagsTitle: string;

  @prop({type: () => [String]})
  tags: string[];
}

