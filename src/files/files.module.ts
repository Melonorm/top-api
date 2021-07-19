import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { ServeStaticModule } from "@nestjs/serve-static";
import { path } from 'app-root-path'

@Module({
  imports: [ServeStaticModule.forRoot({     // т.к. ServeStatic будет использоваться внутри FilesModule (forRoot(), а не forRootAsync(), так как нам никакие конфиги (в .env) не нужны)
    rootPath: `${path}/uploads`,                    // путь, откуда будут сёрвиться файлы
    serveRoot: '/static'                                    // корень пути, который будет выдавать нам статичный файл. У всех файлов, которые мы будем выдавать, будет префикс static
  })],
  controllers: [FilesController],
  providers: [FilesService]
})
export class FilesModule {}
