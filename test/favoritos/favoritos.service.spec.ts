import { Test, TestingModule } from '@nestjs/testing';
import { FavoritosService } from '../../src/favoritos/services/favoritos.service';
import { CreateFavoritoDto } from '../../src/favoritos/dtos/createFavorito.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BooksService } from '../../src/books/services/books.service';
import { GetBooksDto } from '../../src/books/dtos/books.dto';

describe('FavoritosService', () => {
  let service: FavoritosService;

  const mockFavorito: CreateFavoritoDto = {
    googleId: 'abc123',
    title: 'Libro de prueba',
    authors: ['Autor Prueba'],
    thumbnail: 'http://imagen.com/thumb.jpg',
    description: 'Descripción de prueba',
  };

  const mockFavoritoRepo = {
    create: jest.fn().mockImplementation((dto: GetBooksDto) => ({ ...dto, id: 1 })),
    save: jest.fn().mockResolvedValue(mockFavorito),
    find: jest.fn().mockResolvedValue([mockFavorito]),
  };

  const mockBooksService = {
    getOne: jest.fn().mockResolvedValue(mockFavorito),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritosService,
        {
          provide: getRepositoryToken(CreateFavoritoDto),
          useValue: mockFavoritoRepo,
        },
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

    service = module.get<FavoritosService>(FavoritosService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('guardarFavorito', () => {
    it('debe guardar un favorito correctamente', async () => {
      mockBooksService.getOne.mockResolvedValue(mockFavorito);
      mockFavoritoRepo.create.mockReturnValue(mockFavorito);
      mockFavoritoRepo.save.mockResolvedValue(mockFavorito);

      const result = await service.guardarFavorito('abc123');
      expect(mockBooksService.getOne).toHaveBeenCalledWith('abc123');
      expect(mockFavoritoRepo.create).toHaveBeenCalledWith(mockFavorito);
      expect(mockFavoritoRepo.save).toHaveBeenCalledWith(mockFavorito);
      expect(result).toEqual(mockFavorito);
    });

    it('debe manejar errores al guardar favorito', async () => {
      mockBooksService.getOne.mockRejectedValue(new Error('Error'));
      await expect(service.guardarFavorito('abc123')).rejects.toThrow('Error');
    });
  });

  describe('obtenerTodos', () => {
    it('debe retornar todos los favoritos', async () => {
      mockFavoritoRepo.find.mockResolvedValue([mockFavorito]);
      const result = await service.obtenerTodos();
      expect(mockFavoritoRepo.find).toHaveBeenCalled();
      expect(result).toEqual([mockFavorito]);
    });

    it('debe manejar errores al obtener favoritos', async () => {
      mockFavoritoRepo.find.mockRejectedValue(new Error('Error'));
      await expect(service.obtenerTodos()).rejects.toThrow('Error');
    });
  });
});