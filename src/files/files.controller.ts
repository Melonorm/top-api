import { Controller, HttpCode, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { FileElementResponse } from "./dto/file-element.response";
import { FilesService } from "./files.service";
import { MFile } from "./mfile.class";

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {
  }

  /**
   *    Получаем файл, переданный в multipart-форме, передаём его  всервис, который его загружает, заполняет объект возврата (dto),
   * который потом улетает на фронт, как ответ
   * @param file
   */
  @Post('upload')
  @HttpCode(200)
  /*@UseGuards(JwtAuthGuard)*/
  @UseInterceptors(FileInterceptor('files'))    // перехватывает запрос и преобразовывает его в файл, которым можно воспользоваться в методе. Мередаётся мультипарт-форма, в котором есть поле 'files', в котором лежит сам файл
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<FileElementResponse[]> {  // @UploadedFile() -  с помощью декоратора можно вытащить файл, перехваченный интерсептором
    const saveArray: MFile[] = [new MFile(file)];  // массив с сохранёнными файлами. В него будут сохраняться сконвертировнные файлы
    if(file.mimetype.includes('image')) {  // проверка, является ли переданный файл файлом с изображением (поле mimetype содержит инфу о типе файла)
      const buffer: Buffer = await this.filesService.convertToWebP(file.buffer) // если изображение, конвертируем его в webP(и потом в Buffer)...
      saveArray.push(new MFile({    //... в массив пушим новый объект MFile, у которого:
        originalname: `${file.originalname.split('.')[0]}.webp`,   // имя - первая часть имени файла до точки
        buffer                                                             // buffer - сконвертированный в Buffer файл (методом convertToWebP)
      }));
    }
    return this.filesService.saveFiles(saveArray);
  }

}

/*
    npm i -D @types/multer   - для возможности типизации файлов (Express.Multer.File) при их перехвате и загрузки через декоратор @UploadedFile()
 */
