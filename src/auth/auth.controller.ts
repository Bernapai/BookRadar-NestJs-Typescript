import { Controller, Post } from '@nestjs/common';
import { loginUser } from './dtos/loginUser.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Post('login')
  async login(loginDto: loginUser) {
    return await this.authService.login(loginDto);
  }
}
