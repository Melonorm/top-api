import { prop } from "@typegoose/typegoose";
import { TimeStamps, Base } from "@typegoose/typegoose/lib/defaultClasses";

export interface UserModel extends Base {}  // Base - класс, добавляющий таблице идентификационные поля (например, id)
export class UserModel extends TimeStamps{   // TimeStamps - класс, добавляющий таблице поля, отвечающие за время (время создания объекта и время моификации)

  @prop({unique: true})  // unique: true - делает поле уникальным индексом в БД
  email: string;

  @prop()
  passwordHash: string;
}
