import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthDto } from "./dto/auth.dto";
import { UserModel } from "./user.model";
import { ModelType } from "@typegoose/typegoose/lib/types";
import { InjectModel } from "nestjs-typegoose";
import { compare, genSalt, hash } from "bcryptjs";
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from "./auth.constants";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
              private readonly jwtService: JwtService) {
  }

  async createUser(dto: AuthDto) {
    const salt = await genSalt(10); // соль (ассинхронная генерация) для шифрования пароля
    const newUser = new this.userModel({   // перед тем, как сохранить юзера в БД, нужно создать объект новой модели юзера на основе данных, пришедших в dto.
      email: dto.login,
      passwordHash: await hash(dto.password, salt)   // пароль должен храниться в захешированном виде в БД (hash() библиотеки bcryptjs)
    });
    return newUser.save();  // записываем созланного нового юзера в БД
  }

  /**
   * Поиск юзера в БД по его email
   * @param email
   */
  async findUser(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  
  async validateUser(email: string, password: string): Promise<Pick<UserModel, 'email'>> {
    const user = await this.findUser(email);  // сначала проверяем есть ли юзер с таким email в БД
    if (!user) {   // если его нет, кидаем UnauthorizedException на фронт
      throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
    }
    // если юзер есть, проверяем его пароль....
    const isCorrectPassword: boolean = await compare(password, user.passwordHash);  // сравниваем переданный пароль с паролем найденного юзера
    if (!isCorrectPassword) { // если пароли не совпадают, кидаем UnauthorizedException
      throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
    }
    return { email: user.email };  // если всё хорошо, возвращаем JSON с email юзера (для JWT)
  }

  async login(email: string) {
    const payload = { email }; // данные, которые будут шифроваться в JWT
    return {
      access_token: await this.jwtService.signAsync(payload)   // возвращаем JTW, подписанным нашим payload данными
    }
  }

  getAll() {
    return this.userModel.find()
  }
}
