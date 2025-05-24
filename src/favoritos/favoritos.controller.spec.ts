import { Test, TestingModule } from '@nestjs/testing';
import { FavoritosController } from './favoritos.controller';
import { FavoritosService } from './favoritos.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Favorito } from './dtos/createFavorito.dto';

describe('FavoritosController', () => {
  let controller: FavoritosController;

  const mockFavorito: Favorito = {
    googleId: 'abc123',
    title: 'El Principito',
    authors: ['Antoine de Saint-Exupéry'],
    thumbnail: 'https://example.com/thumb.jpg',
    description: 'Un libro clásico',
    id: 0,
  };

  const mockFavoritosService = {
    guardarFavorito: jest.fn().mockResolvedValue(mockFavorito),
    obtenerTodos: jest.fn().mockResolvedValue([mockFavorito]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoritosController],
      providers: [
        {
          provide: FavoritosService,
          useValue: mockFavoritosService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard) // Desactivamos el guard para las pruebas
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<FavoritosController>(FavoritosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('guardarFavorito', () => {
    it('should save and return a favorito', async () => {
      const result = await controller.guardarFavorito('abc123');
      expect(result).toEqual(mockFavorito);
      expect(mockFavoritosService.guardarFavorito).toHaveBeenCalledWith(
        'abc123',
      );
    });
  });

  describe('obtenerTodos', () => {
    it('should return an array of favoritos', async () => {
      const result = await controller.obtenerTodos();
      expect(result).toEqual([mockFavorito]);
      expect(mockFavoritosService.obtenerTodos).toHaveBeenCalled();
    });
  });
});
