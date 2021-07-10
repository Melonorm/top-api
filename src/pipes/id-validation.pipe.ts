import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { InjectModel } from "nestjs-typegoose";
import { Types } from "mongoose";
import { ID_VALIDATION_ERROR } from "./id-validation.constants";

/**
 * Pipe валидации полей id типа ObjectId
 */
@Injectable()   // класс должен попасть в дерево зависимостей
export class IdValidationPipe implements PipeTransform {  // Класс должен реализовывать PipeTransform, для того, чтоб его можно было использовать, как Pipe

  transform(value: string, metadata: ArgumentMetadata): any {   // метод принимает: value - значение, которое нужно провалидировать, metadata - метаданные о том, где располагается данное значение (в body / query / param или custom)
    if (metadata.type != 'param') {  // если значение находится не в param, мы его не валидируем, а просто возвращаем исходное значение
      return value;
    }
    if (!Types.ObjectId.isValid(value)) {   // если значение value, скастованное в ObjectId невалидное (неправильный формат, длина, символы и т.д.)...
      throw new BadRequestException(ID_VALIDATION_ERROR);     // ... выбрасываем исключение
    }
    return value;   // Если всё хорошо, возвращаем исходное значение (в данном случае мы никак не трансформируем значение value, а просто делаем его валидацию)
  }

}
