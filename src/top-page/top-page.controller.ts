import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { FindTopPageDto } from "./dto/find-top-page.dto";
import { CreateTopPageDto } from "./dto/create-top-page.dto";
import { IdValidationPipe } from "../pipes/id-validation.pipe";
import { TopPageService } from "./top-page.service";
import { NOT_FOUND_TOP_PAGE_ERROR } from "./top-page.constants";

@Controller('top-page')
export class TopPageController {
  constructor(private readonly topPageService: TopPageService) {}

  @UsePipes(new ValidationPipe())
  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    return this.topPageService.create(dto);
  };

  @Get(':id')
  async get (@Param('id', IdValidationPipe) id: string) {
    const foundedPage = await this.topPageService.findById(id);
    if (!foundedPage) {
      throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR);
    }
    return foundedPage;
  }

  @Get('byAlias/:alias')
  async getByAlias (@Param('alias') alias: string) {
    const foundedPage = await this.topPageService.findByAlias(alias);
    if (!foundedPage) {
      throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR);
    }
    return foundedPage;
  }


  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedPage = await this.topPageService.deleteById(id);
    if (!deletedPage) {
      throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR);
    }
  };

  @Patch(':id')
  async patch(@Param('id', IdValidationPipe) id: string, @Body() dto: CreateTopPageDto) {
    const updatedPage = await this.topPageService.updateById(id, dto);
    if (!updatedPage) {
      throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR);
    }
    return updatedPage;
  };

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('find')
  async find(@Body() dto: FindTopPageDto) {
    return this.topPageService.findByCategory(dto.firstCategory); // проверка не нужна, так как непринципально, если вернёт пустой массив
  };

  @Get('textSearch/:text')
  async textSearch(@Param('text') text: string) {
    return this.topPageService.findByText(text);
  };

  @Get('/all/getAll')
  async getAll() {
    return this.topPageService.getAll();
  }

}
