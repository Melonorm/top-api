import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from "../src/app.module";
import { disconnect } from "mongoose";
import { AuthDto } from "../src/auth/dto/auth.dto";


const loginDto: AuthDto = {
  login: "test@mail.com",
  password: "test"
}


describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });


  /**
   * Тест корректного логина
   */
  it('/auth/login (POST) - login success',async (done) => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)   // при вводе корректного логина.пароля.....
      .expect(200)   // ожидаем получить статус 200
      .then(({body}: request.Response) => {
        expect(body.access_token).toBeDefined();   // ... и в body в поле access_token инициализацию какого-ниббудь значения (инициализируется jwt токен)
        done();
      });
  });

  /**
   * Тест некорректного пароля
   */
  it('/auth/login (POST) -  password fail', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({...loginDto, password: "Some incorrect password"}) // спред от объекта loginDto c изменёённым полем password (заранее неправильный пароль)
      .expect(401, {  //  ожидаем получить 401 статус и определённый JSON, описывающий Exception
         statusCode: 401,
         message: "Неправильный пароль",
         error: "Unauthorized"
      })
  });

  /**
   * Тест некорректного логина
   */
  it('/auth/login/ (POST) - login fail', () => {
    return request(app.getHttpServer())
      .post('/auth/login/')
      .send({...loginDto, login: "Some incorrect login"})
      .expect(401, {
         statusCode: 401,
         message: "Пользователь с таким email не найден",
         error: "Unauthorized"
      })
  });

  afterAll(() => {
    disconnect();
  })
});

