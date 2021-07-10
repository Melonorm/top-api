import { AuthGuard } from "@nestjs/passport";

// В данном случае это обычный alias стандартного класса AuthGuard, использующего тип 'jwt'
export class JwtAuthGuard extends AuthGuard('jwt') {
  
}
