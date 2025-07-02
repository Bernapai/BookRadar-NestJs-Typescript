import { Module } from '@nestjs/common';
import { FavoritosService } from './favoritos.service';
import { FavoritosController } from './controllers/favoritos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorito } from './dtos/createFavorito.dto';

@Module({
  imports: [TypeOrmModule.forFeature([Favorito])],
  providers: [FavoritosService],
  controllers: [FavoritosController]
})
export class FavoritosModule { }
