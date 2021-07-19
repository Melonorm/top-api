import { Module } from '@nestjs/common';
import { SitemapController } from './sitemap.controller';
import { TopPageModule } from "../top-page/top-page.module";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  controllers: [SitemapController],
  imports: [
    TopPageModule,   // модуль (его сервисы, контроллеры, объекты и т.д.) TopPageModule используется в этом модуле
    ConfigModule     // имя домена, использующееся в xml файлах сайтмэпа, находится в .env (т.к. изначально прилодение не знает доменного имени)
  ]
})
export class SitemapModule {}
