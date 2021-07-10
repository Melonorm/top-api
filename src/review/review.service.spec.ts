import { Test, TestingModule } from '@nestjs/testing';
import { ReviewService } from './review.service';
import { getModelToken } from "nestjs-typegoose";
import { Types } from "mongoose";

describe('ReviewService', () => {
  let service: ReviewService;

  const exec = { exec: jest.fn() };   // jest.fn() - функция jest, позволяющая эмулировать (мокать) ту или иную функцию
  const reviewRepositoryFactory = () => ({  // функция возвращает объект, который имеет внутри себя find (тестируемую функцию)
    find: () => exec      // find должен вернуть сам объект и функцию exec (по сути тестируемого метода findByProductId() ReviewService)
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewService,
                 // Нужно замокать неостающие зависимоости (в данном случае ReviewModel через factory)
                 {useFactory: reviewRepositoryFactory, provide: getModelToken('ReviewModel')} // getModelToken('ReviewModel') - метод typegoose для получения токена указанной модели (передаётся в виде строки). По этому токену инжектится фабрика модели
      ]

    }).compile();

    service = module.get<ReviewService>(ReviewService);
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findByProductId() working', async () => {
    // подготовка мокнутого объекта бд для вызова теста
    const id = new Types.ObjectId().toHexString();    // замоканый id, по которому будет дёргаться функция findByProductId()
    reviewRepositoryFactory().find().exec.mockReturnValueOnce([{productId: id}]);   // mockReturnValueOnce(id) - функция exec должна один раз вернуть тот объект, который фозвращает тестируемая функция findByProductId(). Для простоты нам с этого объекта нужен только productId продукта, равный мокнутому id
    // дёргаем тестированную функцию на мокнутом объекте
    const res = await service.findByProductId(id);
    expect(res[0].productId).toBe(id);   // ожидаем, что id первого получанного элемента в массиве юудет равен мокнутому id
  });

});
