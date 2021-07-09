import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TypegooseModule } from "nestjs-typegoose";
import { UserModel } from "./user.model";
import { AuthService } from './auth.service';
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { getJWTConfig } from "../configs/jwt.config";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  controllers: [AuthController],
  imports: [
    TypegooseModule.forFeature([  // передаётся информация о моделях, которые будут использоваться мангстом в этом модуле
      {
        typegooseClass: UserModel,   // класс, отвечающий за можель бд
        schemaOptions: {       // опции таблицы
          collection: 'User'   // название таблицы
        }
      }
    ]),
    ConfigModule,   // импортируем ConfigModule перед JwtModule, т.к. в Jwt-сервисах (в данном случае - JwtStrategy) имеется доспуп к константам .env
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],   // инжектим ConfigService, потому что при генерации JWT используем константу JWT_SECRET из .env
      useFactory: getJWTConfig   // для создания токена используется factory, настройки которой передаются в отдельном методе (в нашем configs)
    }),
    PassportModule   // с помощью PassportModule можно применять раздичные стратегии на Guards (для авторизации).
  ],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
