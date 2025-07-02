import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from 'src/books/controllers/books.controller';
import { BooksService } from '../../src/books/services/books.service';
import { GetBooksDto } from '../../src/books/dtos/books.dto';

describe('BooksController', () => {
  let controller: BooksController;

  const mockBooksService = {
    getAll: jest.fn(),
    getOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getBooks', () => {
    it('debería devolver una lista de libros', async () => {
      const mockBooks: GetBooksDto[] = [
        {
          googleId: '123',
          title: 'NestJS Básico',
          authors: ['Autor Uno'],
          thumbnail: 'imagen.jpg',
          description: 'Un libro sobre NestJS',
        },
      ];
      mockBooksService.getAll.mockResolvedValue(mockBooks);

      const result = await controller.getBooks('nestjs');
      expect(result).toEqual(mockBooks);
      expect(mockBooksService.getAll).toHaveBeenCalledWith('nestjs');
    });
  });

  describe('getBookById', () => {
    it('debería devolver un solo libro por ID', async () => {
      const mockBook: GetBooksDto = {
        googleId: 'abc',
        title: 'Libro Individual',
        authors: ['Autor Uno'],
        thumbnail: 'thumb.jpg',
        description: 'Descripción',
      };

      mockBooksService.getOne.mockResolvedValue(mockBook);

      const result = await controller.getBookById('abc');
      expect(result).toEqual(mockBook);
      expect(mockBooksService.getOne).toHaveBeenCalledWith('abc');
    });
  });
});
