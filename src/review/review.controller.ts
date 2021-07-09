import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post, UseGuards,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { CreateReviewDto } from "./dto/create-review.dto";
import { ReviewService } from "./review.service";
import { REVIEW_NOT_FOUND } from "./review.constants";
import { Types } from "mongoose";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { AuthGuard } from "@nestjs/passport";
import { UserEmail } from "../decorators/user-email.decorator";


@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {
  }

  @UsePipes(new ValidationPipe())  // валидация пришедшего в Body объекта на основании валидационных декораторов в CreateReviewDto (IsString, IsNumber, Max, Min....)
  @Post('create')
  async create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  };

  @UseGuards(AuthGuard('jwt'))   // для использования роута требуется авторизация с применением JWT (проверяется JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id')id: string) {
    const deletedDoc = await this.reviewService.delete(id);
    if (!deletedDoc) {   // обработка null результата. Если документ по Id не найден, кидаем Http-исключение
      throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);  // текст ошибки в отдельной константе, статус ошибки - 404
    }
  };


  @Get(':byProduct/:productId')
  async getByProduct(@Param('productId') productId: string) {

    return this.reviewService.findByProductId(productId);
  };


  @UseGuards(AuthGuard('jwt'))
  @Get('getAll')
  async getAll(@UserEmail() email: string) {   // проверка работоспособности пользовательского декоратора  @UserEmail()...
    console.log(email);                        // ..."вылавливает" из response поле email и выводит его в консоль
    return this.reviewService.getAll();
  }

  @Post('testCreate')
  async testCreate() {
    const testDTO: CreateReviewDto = {
      name: 'NameTest2',
      title: 'TitleTest2',
      description: 'descriptionTest',
      rating: 5,
      productId: new Types.ObjectId().toHexString()
    }
    return this.reviewService.create(testDTO);
  }

  @Delete('clearDB')
  async deleteAll() {
    return this.reviewService.clearDB();
  }
}
