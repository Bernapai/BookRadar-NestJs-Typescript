import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo del usuario',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'juan@example.com',
    description: 'Correo electrónico válido del usuario',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'secreta123',
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
