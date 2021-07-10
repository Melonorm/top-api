import { IsNumber, IsString, Max, Min } from "class-validator";

export class CreateReviewDto {
  @IsString()     // Проверка класс-валидатором переаётся ли нам в переменную именно строка
  name: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @Max(5)        // рейтинг не может быть больше 5ти...
  @Min(1, {message: 'Рейтинг не может быть менее 1'})        // ... и меньше 1. В случае ошибки выведен соответствующее сообщение
  @IsNumber()
  rating: number;

  @IsString()
  productId: /*Types.ObjectId*/string; // с фронта productId будет приходить в ввиде строки, которая будет конвертировться в Types.ObjectId
}
