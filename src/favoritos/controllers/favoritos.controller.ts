import { Controller, Post, Param, Get, UseGuards } from '@nestjs/common';
import { FavoritosService } from './favoritos.service';
import { Favorito } from '../dtos/createFavorito.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Favoritos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('favoritos')
export class FavoritosController {
  constructor(private readonly favoritosService: FavoritosService) { }

  @Post(':id')
  @ApiOperation({ summary: 'Guardar un libro como favorito por su Google ID' })
  @ApiResponse({
    status: 201,
    description: 'Libro guardado como favorito correctamente',
    type: Favorito,
  })
  @ApiResponse({ status: 404, description: 'Libro no encontrado en Google Books' })
  async guardarFavorito(@Param('id') id: string): Promise<Favorito> {
    return await this.favoritosService.guardarFavorito(id);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los libros guardados como favoritos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de libros favoritos',
    type: [Favorito],
  })
  async obtenerTodos(): Promise<Favorito[]> {
    return await this.favoritosService.obtenerTodos();
  }
}
