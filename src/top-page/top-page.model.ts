import { TimeStamps, Base } from "@typegoose/typegoose/lib/defaultClasses";
import { prop } from "@typegoose/typegoose";

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
export class TopPageModel extends TimeStamps {

  @prop({enum: TopLevelCategory})    // сообщает декоратору, что поле - enum
  firstCategory: TopLevelCategory;

  @prop()
  secondCategory: string;

  @prop({unique: true})   // alias должен быть уникальным, чтобы потом можно было получать объект по его значению alias
  alias: string

  @prop()
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

