import { Test, TestingModule } from '@nestjs/testing';
import { FavoritosController } from '../../src/favoritos/controllers/favoritos.controller';
import { FavoritosService } from 'src/favoritos/services/favoritos.service';
import { AuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateFavoritoDto } from '../../src/favoritos/dtos/createFavorito.dto';

describe('FavoritosController', () => {
  let controller: FavoritosController;

  const mockFavorito: CreateFavoritoDto = {
    googleId: 'abc123',
    title: 'El Principito',
    authors: ['Antoine de Saint-Exupéry'],
    thumbnail: 'https://example.com/thumb.jpg',
    description: 'Un libro clásico',
  };

  const mockFavoritosService = {
    guardarFavorito: jest.fn(),
    obtenerTodos: jest.fn(),
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
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<FavoritosController>(FavoritosController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('guardarFavorito', () => {
    it('debe guardar y retornar un favorito', async () => {
      mockFavoritosService.guardarFavorito.mockResolvedValue(mockFavorito);
      const result = await controller.guardarFavorito('abc123');
      expect(result).toEqual(mockFavorito);
      expect(mockFavoritosService.guardarFavorito).toHaveBeenCalledWith('abc123');
    });

    it('debe manejar errores al guardar favorito', async () => {
      mockFavoritosService.guardarFavorito.mockRejectedValue(new Error('Error'));
      await expect(controller.guardarFavorito('abc123')).rejects.toThrow('Error');
    });
  });

  describe('obtenerTodos', () => {
    it('debe retornar un array de favoritos', async () => {
      mockFavoritosService.obtenerTodos.mockResolvedValue([mockFavorito]);
      const result = await controller.obtenerTodos();
      expect(result).toEqual([mockFavorito]);
      expect(mockFavoritosService.obtenerTodos).toHaveBeenCalled();
    });

    it('debe manejar errores al obtener favoritos', async () => {
      mockFavoritosService.obtenerTodos.mockRejectedValue(new Error('Error'));
      await expect(controller.obtenerTodos()).rejects.toThrow('Error');
    });
  });
});