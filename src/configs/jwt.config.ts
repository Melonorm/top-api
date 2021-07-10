import { ConfigService } from "@nestjs/config";
import { JwtModuleOptions } from "@nestjs/jwt";

export const getJWTConfig = async (configService: ConfigService): Promise<JwtModuleOptions> => {  // принимаем ConfigService, потому что будем использовать константу из .env
  return {
    secret: configService.get('JWT_SECRET')
  };
}
