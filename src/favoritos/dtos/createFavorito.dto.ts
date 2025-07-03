import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFavoritoDto {
  @ApiProperty({
    example: 'zyTCAlFPjgYC',
    description: 'ID del libro en Google Books',
  })
  googleId: string;

  @ApiProperty({
    example: 'Clean Code',
    description: 'Título del libro',
  })
  title: string;

  @ApiPropertyOptional({
    example: ['Robert C. Martin'],
    description: 'Autores del libro',
    type: [String],
  })
  authors?: string[];

  @ApiPropertyOptional({
    example: 'https://example.com/image.jpg',
    description: 'URL de la imagen miniatura del libro',
  })
  thumbnail?: string;

  @ApiPropertyOptional({
    example: 'Un libro sobre buenas prácticas en programación.',
    description: 'Descripción del libro',
  })
  description?: string;
}