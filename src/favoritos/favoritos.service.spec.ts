import { Test, TestingModule } from '@nestjs/testing';
import { FavoritosService } from './favoritos.service';
import { Favorito } from './dtos/createFavorito.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BooksService } from '../books/books.service';
import { GetBooksDto } from '../books/books.dto';

describe('FavoritosService', () => {
  let service: FavoritosService;

  const mockBookDto: GetBooksDto = {
    googleId: 'abc123',
    title: 'Libro de prueba',
    authors: ['Autor Prueba'],
    thumbnail: 'http://imagen.com/thumb.jpg',
    description: 'Descripción de prueba',
  };

  const mockFavoritoRepo = {
    create: jest
      .fn()
      .mockImplementation((dto: GetBooksDto): Favorito => dto as Favorito),
    save: jest.fn().mockResolvedValue(mockBookDto),
    find: jest.fn().mockResolvedValue([mockBookDto]),
  };

  const mockBooksService = {
    getOne: jest.fn().mockResolvedValue(mockBookDto),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritosService,
        {
          provide: getRepositoryToken(Favorito),
          useValue: mockFavoritoRepo,
        },
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

    service = module.get<FavoritosService>(FavoritosService);
    jest.clearAllMocks();
  });

  describe('guardarFavorito', () => {
    it('debería guardar un favorito correctamente', async () => {
      const result = await service.guardarFavorito('abc123');

      expect(mockBooksService.getOne).toHaveBeenCalledWith('abc123');
      expect(mockFavoritoRepo.create).toHaveBeenCalledWith(mockBookDto);
      expect(mockFavoritoRepo.save).toHaveBeenCalledWith(mockBookDto);
      expect(result).toEqual(mockBookDto);
    });
  });

  describe('obtenerTodos', () => {
    it('debería retornar todos los favoritos', async () => {
      const result = await service.obtenerTodos();

      expect(mockFavoritoRepo.find).toHaveBeenCalled();
      expect(result).toEqual([mockBookDto]);
    });
  });
});
