import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// Definir la interfaz para el payload del JWT
interface JwtPayload {
  sub: number; // ID del usuario
  name: string; // Nombre del usuario
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'JksIJ093jJS', // La clave secreta del JWT
    });
  }

  // Tipar el parámetro y el retorno de validate
  validate(payload: JwtPayload) {
    if (!payload) {
      throw new UnauthorizedException('Token inválido');
    }

    return { userId: payload.sub, name: payload.name };
  }
}
