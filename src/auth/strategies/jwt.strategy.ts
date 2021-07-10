import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { UserModel } from "../user.model";

/*
  Все стратегии должны:
  1. Наследоваться от PassportStrategy;
  2. Должны быть @Injectable() (т.к. они являются провайдерами)
  3. Должны иметь метод validate(), обеспечивающий валидацию при аутентификации
 */


@Injectable()   // Обязательно нужно указать в AuthModule в качестве провайдера!!!
export class JwtStrategy extends PassportStrategy(Strategy){
  constructor(private readonly configService: ConfigService) {
    super({   // настройки стратегии:
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),  // Включает JWT в запрос. Создает новый экстрактор, который ищет JWT в заголовке авторизации со схемой bearer
      ignoreExpiration: true,                                    // игнорируется время жизни JWT
      secretOrKey: configService.get('JWT_SECRET')              // берёт ключ (секрет) шифрования из .env
    });
  }


  async validate({ email }: Pick<UserModel, 'email'>) {  // Принимает некоторое значение, переданное в ввиде payload (в данном случае в payload передаётся email (см. AuthService.login()))
    return email;               // если валидация прошла успешно, возвращает переданные данные (в данном случае, email)
  }
}
