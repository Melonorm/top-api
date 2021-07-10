import { Injectable } from "@nestjs/common";
import { ReviewModel } from "./review.model";
import { ModelType, DocumentType } from "@typegoose/typegoose/lib/types";   // DocumentType пришлось вносить руками
import { CreateReviewDto } from "./dto/create-review.dto";
import { Types } from "mongoose";
import { InjectModel } from "nestjs-typegoose";


@Injectable()
export class ReviewService {
  constructor(@InjectModel(ReviewModel) private readonly reviewModel: ModelType<ReviewModel>) {}  // Нужно именно @InjectModel, чтобы ReviewModel подтянулась, как провайдер

  async create(dto: CreateReviewDto): Promise<DocumentType<ReviewModel>> { // возвращает Promise от модели документов ReviewModel
    return this.reviewModel.create(dto);
  }

  async delete(id: string): Promise<DocumentType<ReviewModel> | null> {  // null возвращает, если не удалось найти RewiewModel по её id в БД
    return this.reviewModel.findByIdAndDelete(id).exec();  // найти запись во её id и удалить её. exec() - выполнить действие в БД
  }

  async findByProductId(productId: string): Promise<DocumentType<ReviewModel>[]> { // по одному productId ищем несколько отзывов (массив документов ReviewModel)
    return this.reviewModel.find({productId: Types.ObjectId(productId)}).exec();  // переданный productId конвертируется в виде ObjectID
  }

  async deleteByProductId(productId: string) {  // Удаляет все review данные, принадлежащие продукту с id == productId
    return this.reviewModel.deleteMany({productId: Types.ObjectId(productId)}).exec();
  }

  async getAll(): Promise<DocumentType<ReviewModel>[]> {
    return this.reviewModel.find();
  }

  async clearDB() {
    return this.reviewModel.deleteOne();
  }
}
