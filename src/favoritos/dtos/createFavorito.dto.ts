import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Favorito {
  @ApiProperty({
    example: 1,
    description: 'ID autogenerado del favorito',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'zyTCAlFPjgYC',
    description: 'ID del libro en Google Books',
  })
  @Column()
  googleId: string;

  @ApiProperty({
    example: 'Clean Code',
    description: 'Título del libro',
  })
  @Column()
  title: string;

  @ApiProperty({
    example: ['Robert C. Martin'],
    description: 'Autores del libro',
    required: false,
    type: [String],
  })
  @Column('text', { array: true, nullable: true })
  authors: string[];

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'URL de la imagen miniatura del libro',
    required: false,
  })
  @Column({ nullable: true })
  thumbnail: string;

  @ApiProperty({
    example: 'Un libro sobre buenas prácticas en programación.',
    description: 'Descripción del libro',
    required: false,
  })
  @Column('text', { nullable: true })
  description: string;
}
