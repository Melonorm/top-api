/**
 * Класс-обёртка над Express.Multer.File (файлами). Поля обёртки совпадают с полями Express.Multer.File
 */

export class MFile {
  originalname: string;
  buffer: Buffer;

  constructor(file: Express.Multer.File | MFile) {
    this.originalname = file.originalname;
    this.buffer = file.buffer;
  }
}
