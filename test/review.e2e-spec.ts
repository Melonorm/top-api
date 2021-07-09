import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from "../src/app.module";
import { CreateReviewDto } from "../src/review/dto/create-review.dto";
import { Types, disconnect } from "mongoose";
import { REVIEW_NOT_FOUND } from "../src/review/review.constants";
import { AuthDto } from "../src/auth/dto/auth.dto";  // "../src и т.д." желаельно всегда проверять, что импортируются сущности по АБСОЛЮТНЫМ ПУТЯМ!


const loginDto: AuthDto = {  // тестовый логин юзера для роутов, использующих @UseGuards
   login: "test@mail.com",
   password: "test"
}

const productId = new Types.ObjectId().toHexString() // мокнутый id продукта для мокнутого testDto (toHexString() - т.к. передаётся к нам в dto строкой)

const testDto: CreateReviewDto = {  // мокнутое ReviewDto для тестинга
  name: 'Test',
  title: 'Заголовок',
  description: 'Описание продукта',
  rating: 5,
  productId
  // productId: productId // предыдущая запись равноценна этой.
}


describe('ReviewController (e2e)', () => { // describe описывает группу тестов (может быть влоденным в другой describe)
  let app: INestApplication;   // объявление приложения для тестов, которое будет инициализироваться.
  let createdId: string; // переменная полученного id созданного тестового объекта
  let token: string    // токен доступа тестового юзера  (инициализируется в процессе логина)

  beforeEach(async () => { // beforeEach - функция, код которой выполняется непосредственно перед запуском следующего теста теста (весь код следующего блока it будет выполняться перед блоком beforeEach)
    const moduleFixture: TestingModule = await Test.createTestingModule({   // объявление и тестового модуля, в который импортируется модуль, который нужно протестировать.
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Логин тестового юзера:
    const { body } = await request(app.getHttpServer())  // нужный access token нахдится в body запроса на логин
      .post('/auth/login')
      .send(loginDto);                               // передаём параметры тестового юзера
      token = body.access_token;                     // получаем jwt токен и сохраняем его в переменную token
  });

  // it описывает один конкретный блок теста
  /**
   * Тест создания в БД мокнутого объекта
   */
  it('/review/create (POST) - success',async (done) => {          // т.к. в функции используется then, она становится ассинхронной
    return request(app.getHttpServer())
      .post('/review/create')  // роут
      .send(testDto)    // передаём объект, на котором будет тестироваться роут (должен создаться в БД этот  объект)
      .expect(201)  // оидаемый статус запроса при правильном срабатывании
      .then(({body}: request.Response) => {  // автоматическая деструктуризация request и вытаскивание оттуда body
        createdId = body._id;  //
        expect(createdId).toBeDefined(); // ожидаем что createdId будет определён в body запроса (чтоб не был null или undefined )
        done();   // завершение выполнения стрелочной функции
      });
  });

  /**
   * Проверка на попытку создания объекта с неправильными (невалидными) полями
   */
  it('/review/create (POST) - fail',async (done) => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send({...testDto, rating: 0})   // ... создание нового объекта на основе исходного (testDto) и изменёнными полями (rating = 0)
      .expect(400)                    // 400 ошибка - неверные данные
      .then(({body}: request.Response) => { // т.к. роут getByProduct() возвращает массив отзывов....
        console.log(body);
        done();
      });
  });


  /**
   * Тест получения раннее созданного мокнутого объекта по его productId
   */
  it('/review/:byProduct/:productId (GET) - success',async (done) => {  // ассинхронность для получения body ответа
    return request(app.getHttpServer())
      .get('/review/:byProduct/' + productId)
      .expect(200)
      .then(({body}: request.Response) => { // т.к. роут getByProduct() возвращает массив отзывов....
        expect(body.length).toBe(1); // ... ожидаем, что длина массива, вернувшегося с запроса в body будет равна 1 (т.к. у нас есть уже 1 созданный объект review от предыдущего теста )
        done();
      });
  });

  /**
   * Тест получения несуществующего объекта по его productId (если введён неправильный или несуществующий id)
   */
  it('/review/:byProduct/:productId (GET) - fail',async (done) => {
    return request(app.getHttpServer())
      .get('/review/:byProduct/' + new Types.ObjectId().toHexString()) // вставляем рандомный id продукта (его точно нет в БД)
      .expect(200)
      .then(({body}: request.Response) => { // т.к. роут getByProduct() возвращает массив отзывов....
        expect(body.length).toBe(0); // ... ожидаем, что длина массива, вернувшегося с запроса в body будет равна 0 (т.к. у нас нет ни одного созданного объекта review в БД с таким Id )
        done();
      });
  });

  /**
   * Тест удаления из бд раннее созданного мокнутого объекта по его id
   */
  it('/review/:id (DELETE) - success',() => {
    return request(app.getHttpServer())
      .delete('/review/' + createdId)
      .set('Authorization', 'Bearer ' + token)       // передача в Headers авторизационного jwt токена. Первый параметр - имя поля, второй - его значение (напр. Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1lbG9ub3JtMkB5YW5kZXgucnUiLCJpYXQiOjE2MjU0Mjc3MDF9.b8Gh8oKJvrRMmBdMypeeu5kJsgCF8HoBuu1sUQVnTjo)
      .expect(200)
  });   // т.к. функция НЕ ассинхронная, done() не нужен

  /**
   * Тест на попытку удаления по id объекта с БД, если введён несуществующий id
   */
  it('/review/:id (DELETE) - fail',() => {
    return request(app.getHttpServer())
      .delete('/review/' + new Types.ObjectId().toHexString()) // рандомнй id (его точно нет в БД)
      .set('Authorization', 'Bearer ' + token)      // передача в Headers авторизационного jwt токена.
      .expect(404,{  // ожидаем получить статус 404 и объект со значением статуса и соответствующим сообщением (обработака была в роуте delete контроллера)
        statusCode: 404,
        message: REVIEW_NOT_FOUND
      }); // 404 потому что такого id не будет в БД
  });



  afterAll(() => {   // после всех тестов...
    disconnect();       // ...сделать дисконнект мангусту
  })
});


// beforeEach - блок кода, выполняющегося перед конктерным тестовым блоком it
// beforeAll - блок кода, выполняющегося перед всеми тестовыми блоками it
// afterEach - блок кода, выполняющегося после конкретного тестового блока it
// afterAll  - блок кода, выполняющегося после всех тестовых блоков it
