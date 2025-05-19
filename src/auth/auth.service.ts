import { Injectable, UnauthorizedException } from '@nestjs/common';
import { loginUser } from './dtos/loginUser.dto';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async login(loginDto: loginUser) {
    const { name, password } = loginDto;
    const user = await this.usersService.findUserByName(name);
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const payload = { sub: user.id, name: user.name };
    return { access_token: this.jwtService.sign(payload) };
  }
}
