import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from '../../src/books/services/books.service';
import { GetBooksDto } from '../../src/books/dtos/books.dto';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('BooksService', () => {
  let service: BooksService;

  const mockBook: GetBooksDto = {
    googleId: 'zyTCAlFPjgYC',
    title: 'Clean Code',
    authors: ['Robert C. Martin'],
    thumbnail: 'https://example.com/image.jpg',
    description: 'Un libro sobre buenas prácticas en programación.',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BooksService],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('debe retornar una lista de libros', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          items: [
            {
              id: 'zyTCAlFPjgYC',
              volumeInfo: {
                title: 'Clean Code',
                authors: ['Robert C. Martin'],
                imageLinks: { thumbnail: 'https://example.com/image.jpg' },
                description: 'Un libro sobre buenas prácticas en programación.',
              },
            },
          ],
        },
      });

      const result = await service.getAll('Clean Code');
      expect(result).toEqual([mockBook]);
    });

    it('debe retornar un array vacío si no hay items', async () => {
      mockedAxios.get.mockResolvedValue({ data: { items: undefined } });
      const result = await service.getAll('Clean Code');
      expect(result).toEqual([]);
    });

    it('debe lanzar error si la query está vacía', async () => {
      await expect(service.getAll('')).rejects.toThrow('La consulta no puede estar vacía');
    });

    it('debe manejar errores de axios', async () => {
      mockedAxios.get.mockRejectedValue({ response: { data: { error: { message: 'API error' } }, status: 500 }, isAxiosError: true });
      await expect(service.getAll('Clean Code')).rejects.toThrow('API error');
    });

    it('debe manejar errores inesperados', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Error inesperado'));
      await expect(service.getAll('Clean Code')).rejects.toThrow('Error inesperado al buscar libros');
    });
  });

  describe('getOne', () => {
    it('debe retornar un libro por id', async () => {
      mockedAxios.get.mockResolvedValue({
        data: {
          id: 'zyTCAlFPjgYC',
          volumeInfo: {
            title: 'Clean Code',
            authors: ['Robert C. Martin'],
            imageLinks: { thumbnail: 'https://example.com/image.jpg' },
            description: 'Un libro sobre buenas prácticas en programación.',
          },
        },
      });

      const result = await service.getOne('zyTCAlFPjgYC');
      expect(result).toEqual(mockBook);
    });

    it('debe lanzar error si el id está vacío', async () => {
      await expect(service.getOne('')).rejects.toThrow('El ID no puede estar vacío');
    });

    it('debe manejar error 404', async () => {
      mockedAxios.get.mockRejectedValue({ response: { status: 404 }, isAxiosError: true });
      await expect(service.getOne('no-existe')).rejects.toThrow('Libro no encontrado');
    });

    it('debe manejar errores de axios', async () => {
      mockedAxios.get.mockRejectedValue({ response: { data: { error: { message: 'API error' } }, status: 500 }, isAxiosError: true });
      await expect(service.getOne('zyTCAlFPjgYC')).rejects.toThrow('API error');
    });

    it('debe manejar errores inesperados', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Error inesperado'));
      await expect(service.getOne('zyTCAlFPjgYC')).rejects.toThrow('Error inesperado al obtener el libro');
    });
  }
  );
});