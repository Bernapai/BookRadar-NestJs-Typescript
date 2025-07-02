import { IsString, IsArray, IsOptional } from 'class-validator';

export class GetBooksDto {
  @IsString()
  googleId: string;

  @IsString()
  title: string;

  @IsArray()
  @IsOptional()
  authors?: string[];

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
