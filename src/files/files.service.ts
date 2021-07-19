import { Injectable } from '@nestjs/common';
import { FileElementResponse } from "./dto/file-element.response";
import { format } from 'date-fns';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import * as sharp from 'sharp';
import { MFile } from "./mfile.class";          // у sharp нет дефолтного импорта.

@Injectable()
export class FilesService {

  async saveFiles(files: MFile[]): Promise<FileElementResponse[]> {
    const dateFolder: string = format(new Date(), 'yyyy-MM-dd');   // задаём имя папки по текущей дате (форматирование даты по шаблону)
    const uploadFolder: string = `${path}/uploads/${dateFolder}`;                // генерируем путь к папке с файлами (path - корень проекта (библ. app-root-path))
    await ensureDir(uploadFolder);    // проверка наличия папки для файлов. Если её нет ещё, она создаётся (библ. fs-extra)

    const res: FileElementResponse[] = [];  // пустой (пока) массив для складывания сконвертированных dto с массива файлов
    for(const file of files) {   // проходимся по массиву файлов....
      await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);  // ... записываем их в папку (имя файла соостветствует полю originalname), второй аргумент буффер (байтовый?) с самим файлом
      res.push({ url: `${dateFolder}/${file.originalname}`, name: file.originalname}); // генерируем из файла dto и ложим её в массив для dto
    }
    return res;
  }

  /**
   * Берём файл в виде Buffer, конвертируем его в WebP и потом обратно в Buffer (библ sharp)
   * @param file
   */
  convertToWebP(file: Buffer) {
    return sharp(file)
      .webp()
      .toBuffer()
  }
}

/*
    npm i fs-extra - сожержит наборы полезных методов для работы с файлами, упрощающие стандартную нодовскую библиотеку fs (FileSystem).
    npm i -D @types/fs-extra

    npm i app-root-path - позволяет не зависимо от операцонной системы всегда определить корень проекта
    npm i -D @types/app-root-path

    npm i date-fns - позволяет сконвертировать дату в нужный формат (например, в string для названия папки, состоящее из текущей даты)

    npm i -D @types/multer   - для возможности типизации файлов (Express.Multer.File) при их перехвате и загрузки через декоратор @UploadedFile()

    npm i sharp - конвертирует файлы в другие форматы (webP в данном случае). Очень быстрая
    npm i -D @types/sharp

    npm i @nestjs/serve-static - позволяет статично сёрвить какие-то ресурсы из указанной папки
 */
