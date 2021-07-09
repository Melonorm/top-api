import { BadRequestException, Body, Controller, Get, HttpCode, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { AuthDto } from "./dto/auth.dto";
import { AuthService } from "./auth.service";
import { ALREADY_REGISTERED_ERROR } from "./auth.constants";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: AuthDto) { // из запроса извлекается Body() объекта AuthDto
    // перед тем, как создать нового юзера, нужно проверить, есть ли уже юзер с таким же логином (email`ом) в БД (т.к. его логин (email) уникальный)
    const oldUser = await this.authService.findUser(dto.login); // пробуем найти юзера с таким же логином в БД (если не null, то юзер такой уже был там)
    if (oldUser) {   // если пользователь с таким логином нашёлся, кидается HttpException (его наследник - BadRequestException)
      throw new BadRequestException(ALREADY_REGISTERED_ERROR);
    }
    return this.authService.createUser(dto); // создаём пользователя в БД, если не был найден с идентичным логином
  };


  @UsePipes(new ValidationPipe())
  @HttpCode(200)  // код статуса при корректном запросе
  @Post('login')
  async login(/*@Body() dto: AuthDto*/@Body() {login, password}: AuthDto) {  // деструктуризация объекта (вместо самого объекта (dto) в body передаётся JSON с его полями)
//    const user = await this.authService.validateUser(login, password);
//    return this.authService.login(user)
    const { email } = await this.authService.validateUser(login, password);  // деструктурировали объект user
    return this.authService.login(email);
  };


  @Get('getAll')
  getAll() {
    return this.authService.getAll();
  }
}
