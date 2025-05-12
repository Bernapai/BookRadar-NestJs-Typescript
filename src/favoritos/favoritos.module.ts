import { Module } from '@nestjs/common';
import { FavoritosService } from './favoritos.service';
import { FavoritosController } from './favoritos.controller';

@Module({
  providers: [FavoritosService],
  controllers: [FavoritosController]
})
export class FavoritosModule {}
