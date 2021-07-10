import { ConfigService } from "@nestjs/config";
import { TypegooseModuleOptions } from "nestjs-typegoose";

export const getMongoConfig = async (configService: ConfigService): Promise<TypegooseModuleOptions> => {
  return {
    uri: getMongoString(configService),
    ...getMongoOptions()  // "..." - спред-оператор. Объект, который вернёт функция (getMongoOptions), раскидывается внутрь внешнего объекта (getMongoConfig)
  };
};

// mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]
const getMongoString = (configService: ConfigService) =>
  'mongodb://' +
  // configService.get('MONGO_LOGIN') +
  // ':' +
  // configService.get('MONGO_PASSWORD') +
  // '@' +
  configService.get('MONGO_HOST') +
  ':' +
  configService.get('MONGO_PORT') +
   '/' +
  configService.get('MONGO_AUTHDATABASE');


const getMongoOptions = () => ({
  useNewUrlParser: true, // парсер URL для правильного парсинга строки подключения
  useCreateIndex: true,  // создание индексов
  useUnifiedTopology: true // единая топология
});


