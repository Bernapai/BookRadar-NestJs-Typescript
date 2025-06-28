import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class loginDto {
  @ApiProperty({
    example: 'juanperez',
    description: 'Nombre de usuario',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'contraseñaSegura123',
    description: 'Contraseña del usuario',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
