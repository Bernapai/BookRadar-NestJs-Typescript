import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'Juan Pérez',
    description: 'Nuevo nombre del usuario (opcional)',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'juan.nuevo@example.com',
    description: 'Nuevo correo electrónico (opcional)',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: 'nuevaClave123',
    description: 'Nueva contraseña (mínimo 6 caracteres, opcional)',
    minLength: 6,
  })
  @IsOptional()
  @MinLength(6)
  password?: string;
}
