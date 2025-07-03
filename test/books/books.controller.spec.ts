import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from '../../src/books/controllers/books.controller';
import { BooksService } from '../../src/books/services/books.service';
import { GetBooksDto } from '../../src/books/dtos/books.dto';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  const mockBook: GetBooksDto = {
    googleId: 'zyTCAlFPjgYC',
    title: 'Clean Code',
    authors: ['Robert C. Martin'],
    thumbnail: 'https://example.com/image.jpg',
    description: 'Un libro sobre buenas prácticas en programación.',
  };

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
    service = module.get<BooksService>(BooksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getBooks', () => {
    it('debe retornar una lista de libros', async () => {
      mockBooksService.getAll.mockResolvedValue([mockBook]);
      const result = await controller.getBooks('Clean Code');
      expect(result).toEqual([mockBook]);
      expect(mockBooksService.getAll).toHaveBeenCalledWith('Clean Code');
    });

    it('debe manejar errores', async () => {
      mockBooksService.getAll.mockRejectedValue(new Error('Error'));
      await expect(controller.getBooks('Clean Code')).rejects.toThrow('Error');
    });
  });

  describe('getBookById', () => {
    it('debe retornar un libro por id', async () => {
      mockBooksService.getOne.mockResolvedValue(mockBook);
      const result = await controller.getBookById('zyTCAlFPjgYC');
      expect(result).toEqual(mockBook);
      expect(mockBooksService.getOne).toHaveBeenCalledWith('zyTCAlFPjgYC');
    });

    it('debe manejar errores', async () => {
      mockBooksService.getOne.mockRejectedValue(new Error('Error'));
      await expect(controller.getBookById('zyTCAlFPjgYC')).rejects.toThrow('Error');
    });
  });
});