import { IsString, IsArray } from 'class-validator';

export class CreateFavoriteDto {
  @IsString()
  googleId: string;

  @IsString()
  title: string;

  @IsArray()
  @IsString({ each: true })
  authors: string[];

  @IsString()
  description: string;
}
