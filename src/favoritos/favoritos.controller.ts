import { Controller, Post, Param, Get, UseGuards } from '@nestjs/common';
import { FavoritosService } from './favoritos.service';
import { Favorito } from './dtos/createFavorito.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('favoritos')
@UseGuards(JwtAuthGuard)
export class FavoritosController {
  constructor(private readonly favoritosService: FavoritosService) { }

  // POST /favoritos/:id
  @Post(':id')
  async guardarFavorito(@Param('id') id: string): Promise<Favorito> {
    return await this.favoritosService.guardarFavorito(id);
  }

  // GET /favoritos
  @Get()
  async obtenerTodos(): Promise<Favorito[]> {
    return await this.favoritosService.obtenerTodos();
  }
}
