import { createParamDecorator, ExecutionContext } from "@nestjs/common";   // функция создания своего декоратора для получения определённых данных из запроса

export const UserEmail = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {   // createParamDecorator принимает аргументом стрелочную функцию, у которой первым параметром идёт data - данные из запроса. Вторым параметром идёт контекст исполнения запроса (ExecutionContext)
    const request = ctx.switchToHttp().getRequest();  // получение репроса из контекста. switchToHttp() - указание типа контекста (в данном случае http). getRequest() - получение запроса из контекста
    return request.user;  // получение из запроса поля юзера (в конкретном случае, это будет email)
  }
)
